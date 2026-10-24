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
    stage('Install backend dependencies') {
      steps { dir('backend') { sh 'npm install' } }
    }
    stage('Install frontend dependencies') {
      steps { dir('frontend') { sh 'npm install' } }
    }
    stage('Backend smoke test') {
      steps { dir('backend') { sh 'npm test' } }
    }
    stage('Frontend production build') {
      steps { dir('frontend') { sh 'npm run build' } }
    }
    stage('Deployment readiness') {
      steps {
        echo 'Build and smoke tests passed. Configure a deployment stage for your target host.'
        archiveArtifacts artifacts: 'frontend/.next/**,backend/src/**,backend/package.json,frontend/package.json', fingerprint: true, allowEmptyArchive: true
      }
    }
  }
  post {
    success { echo 'SUCCESS: BEM IT Del Inventory passed CI checks.' }
    failure { echo 'FAILED: Check console output for install, test, or build errors.' }
    always { echo 'Pipeline completed.' }
  }
}
