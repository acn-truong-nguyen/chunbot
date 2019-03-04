pipeline {
  agent any
  stages {
    stage('Clone repository') { // for display purposes
      steps {
        echo 'Working directory'
        sh 'pwd'
        // Get source code from GitHub repository
        git branch: 'master', url:'https://github.com/acn-truong-nguyen/chunbot.git'
        // Check if source code is downloaded
        sh "ls -lat"   
      }
    }
    stage('Build image') {
      steps{
          echo 'Build docker image'
          sh "docker build -t chunbot ."
      }
    }
    stage('Run image') {
      steps{
        echo 'Stop running container'
        sh "docker stop chunbot-container || true && docker rm chunbot-container || true"
        echo 'Remove dangling images'
        sh 'docker rmi -f $(docker images -f "dangling=true" -q)'
        echo 'Run new image'
        withCredentials([
            usernamePassword(credentialsId: 'chunbot-account', usernameVariable: 'JENKINSUSER', passwordVariable: 'JENKINSPASS')
            ,string(credentialsId: 'JENKINS_BOT_INCOMING_API_KEY', variable: 'BOTAPIKEY')
            ,string(credentialsId: 'MSTEAMS_INCOMING_WEBHOOK_URL', variable: 'TEAMSURL')
            ,string(credentialsId: 'MSTEAMS_OUTGOING_WEBHOOK_SECRET', variable: 'TEAMSSECRET')
        ]) {
          sh """
            set +x
            docker run \
            -d \
            -e MSTEAMS_INCOMING_WEBHOOK_URL=$TEAMSURL \
            -e MSTEAMS_OUTGOING_WEBHOOK_SECRET=$TEAMSSECRET \
            -e JENKINS_URL=${env.JENKINS_URL} \
            -e JENKINS_USERNAME=$JENKINSUSER \
            -e JENKINS_PASSWORD=$JENKINSPASS \
            -e JENKINS_BOT_INCOMING_API_KEY=$BOTAPIKEY \
            --name chunbot-container \
            -p 3000:3000 \
            chunbot
          """      
        }
      }
    }
  }
}