pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Cloning repository...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Building the application...'
                // Example build command, replace with your actual build step
                sh 'echo Simulating build...'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying the application...'
                // Example deploy command, replace with your real deployment logic
                sh 'echo Simulating deployment...'
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
