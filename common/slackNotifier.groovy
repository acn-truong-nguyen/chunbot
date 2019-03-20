def call(String buildResult, String nodeEnv) {
  if (buildResult == "STARTED") {
    slackSend color: "warning", message: "chunbot [${nodeEnv}] Build #${env.BUILD_NUMBER} Started (<${env.BUILD_URL}|Open>)"
  }
  else if ( buildResult == "SUCCESS" ) {
    slackSend color: "good", message: "chunbot [${nodeEnv}] Build #${env.BUILD_NUMBER} was successful (<${env.BUILD_URL}|Open>)"
  }
  else if( buildResult == "FAILURE" ) { 
    slackSend color: "danger", message: "chunbot [${nodeEnv}] Build #${env.BUILD_NUMBER} was failed (<${env.BUILD_URL}|Open>)"
  }
  else if( buildResult == "UNSTABLE" ) { 
    slackSend color: "warning", message: "chunbot [${nodeEnv}] Build #${env.BUILD_NUMBER} was unstable (<${env.BUILD_URL}|Open>)"
  }
  else {
    slackSend color: "danger", message: "chunbot [${nodeEnv}] Build #${env.BUILD_NUMBER} stopped with unclear result (<${env.BUILD_URL}|Open>)"	
  }
}

return this