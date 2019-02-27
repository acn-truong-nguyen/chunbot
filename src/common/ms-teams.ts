import request from 'request-promise';

interface MSTeamsMessage {
  '@type': string;
  '@context': string;
  themeColor: string;
  summary: string;
  sections: [MSTeamsMessageSection];
  potentialAction: [MSTeamsMessagePotentialAction];
}

export interface MSTeamsMessageSection {
  activityTitle: string;
  activitySubtitle: string;
  activityImage: string;
  facts: [MSTeamsMessageSectionFacts];
  markdown: boolean;
}

export interface MSTeamsMessageSectionFacts {
  name: string;
  value: string;
}

export interface MSTeamsMessagePotentialAction {
  '@type': string;
  name: string;
  inputs?: [MSTeamsMessageInput];
  actions: [MSTeamsMessageAction];
}

export interface MSTeamsMessageInput {
  '@type': string;
  id: string;
  isMultiline: boolean;
  title: string;
}

export interface MSTeamsMessageAction {
  '@type': string;
  name: string;
  targets: any;
}

export class MSTeamMessageCard {
  message: MSTeamsMessage;
  constructor(themeColor: string, summary: string,
              sections: [MSTeamsMessageSection],
              potentialAction: any) {
    this.message = {
      themeColor,
      summary,
      sections,
      potentialAction,
      '@type': 'MessageCard',
      '@context': 'http://schema.org/extensions',
    };
  }
  async sendMessage(webhookURL?: string) {
    const uri = webhookURL || process.env.MSTEAM_INCOMING_WEBHOOK_URL;
    const options: any = {
      uri,
      method: 'POST',
      body: this.message,
      json: true,
    };
    await request(options);
  }
}
