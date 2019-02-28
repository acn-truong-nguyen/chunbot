import { Request, Response } from 'express';
import { MSTeamMessageCard,
         MSTeamsMessageSection,
         MSTeamsMessageSectionFacts,
       } from '../common/ms-teams';
import { defaultConfig } from '../common/config';
import { toLocalDate, getJobName } from '../common/utility';
import request = require('request-promise');
import { logger } from '../common/logger';

export let echoMessage = async (req: Request, res: Response) => {
  res.status(200);
  const jobName = getJobName(req.body.text);
  const responseMsg = {
    type: 'message',
    textFormat: 'plain',
    text: 'Sorry, I cannot process your request. Please try again.'
        + ' Request format: jenkins build <Job name>',
  };
  if (!jobName) {
    res.send(JSON.stringify(responseMsg));
    return;
  }
  const jenkinsURL = `${process.env.JENKINS_URL}/job/${jobName}`;
  const options: any = {
    uri: `${jenkinsURL}`
       + `/buildWithParameters?CULPRIT=${req.body.from.name}`,
    method: 'POST',
    json: true,
  };
  logger.info(`Sending request to Jenkins server. Job: ${jobName}, Culprit: ${req.body.from.name}`);
  try {
    await request(options);
    responseMsg.text = 'I have sent signals to Jenkins server.'
                     + ' Your request will be processed shortly.';
  } catch (err) {
    if (err.statusCode === 404) {
      responseMsg.text = `Job ${jobName} does not exist.`;
    } else {
      logger.error(err);
      responseMsg.text = 'Sorry, I cannot process your request.'
                       + ' There might be some problem with Jenkins server';
    }
  } finally {
    res.send(JSON.stringify(responseMsg));
  }
};

export let incomingJenkins = async (req: Request, res: Response) => {
  const buildInfo = req.body;
  let color;
  let summary = `Update from build ${buildInfo.jobName}`
              + `${buildInfo.displayName} started by ${buildInfo.user}`;
  let facts: [MSTeamsMessageSectionFacts] = ([
    {
      name: 'Status',
      value: buildInfo.status,
    },
    {
      name: 'Start time',
      value: toLocalDate(Number(buildInfo.startTime)),
    },
    {
      name: 'Completion time',
      value: toLocalDate(Number(buildInfo.startTime) + Number(buildInfo.duration)),
    },
    {
      name: 'Culprits',
      value: buildInfo.user,
    },
    {
      name: 'Changes',
      value: buildInfo.changeSets,
    },
  ]) as any;
  switch (buildInfo.status) {
    case 'SUCCESS':
      color = defaultConfig.TEAMS.THEME_COLOR.SUCCESS;
      break;
    case 'UNSTABLE':
      color = defaultConfig.TEAMS.THEME_COLOR.WARNING;
      break;
    case 'FAILURE':
      color = defaultConfig.TEAMS.THEME_COLOR.ERROR;
      break;
    default:
      facts = facts.filter(e => e.name !== 'Completion time') as any;
      color = defaultConfig.TEAMS.THEME_COLOR.INFO;
      summary = `User ${buildInfo.user} started job ${buildInfo.jobName}${buildInfo.displayName}`;
      break;
  }
  const section: MSTeamsMessageSection = {
    facts,
    activityTitle: summary,
    activitySubtitle: `Latest status of ${buildInfo.jobName}${buildInfo.displayName}`,
    activityImage: null,
    markdown: true,
  };
  const potentialAction: any = {
    '@type': 'OpenUri',
    name: 'View Build',
    targets: [{ os: 'default', uri: buildInfo.buildUrl }],
  };
  const messageCard = new MSTeamMessageCard(color, summary, [section], [potentialAction]);
  try {
    await messageCard.sendMessage(process.env.MSTEAMS_INCOMING_WEBHOOK_URL);
  } catch (err) {
    logger.error(err);
    res.status(500)
    .send('Internal Error');
    return;
  }
  res.send('Success');
};
