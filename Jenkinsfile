pipeline {
  agent any
  options { timestamps(); disableConcurrentBuilds() }
  environment {
    CI = 'true'
    NEXT_PUBLIC_API_URL = 'http://localhost:4000/api'
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Install frontend dependencies') {
      steps { dir('frontend') { sh 'npm install' } }
    }
    stage('Frontend tests') {
      steps { dir('frontend') { sh 'npm test' } }
    }
    stage('Frontend production build') {
      steps { dir('frontend') { sh 'npm run build' } }
    }
    stage('Deployment readiness') {
      steps {
        echo 'Build and tests passed. Configure a deployment stage for your target host.'
        archiveArtifacts artifacts: 'frontend/.next/**,frontend/package.json', fingerprint: true, allowEmptyArchive: true
      }
    }
  }
  post {
    success { echo 'SUCCESS: BEM IT Del Inventory passed CI checks.' }
    failure { echo 'FAILED: Check console output for install, test, or build errors.' }
    always { echo 'Pipeline completed.' }
  }
}
