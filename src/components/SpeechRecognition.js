import React from "react";

const API_URL = 'http://172.17.0.3/'
const recognize_URL = 'http://localhost:8000/audio/recognize_audio'
const generate_URL = 'http://localhost:8000/llm/question'

export default class SpeechRecognition extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            question: '',
            answer: ''
        };

        this.audioChunks = [];

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                this.mediaRecorder = new MediaRecorder(stream);
                this.mediaRecorder.ondataavailable = (event) => {
                    this.audioChunks.push(event.data);
                };
                this.mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(this.audioChunks, { type: 'audio/mpeg' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);
                    this.setState({ question: 'Audio Recorded...' });
                    const formData = new FormData();
                    formData.append('audio', audioBlob, 'recorded_audio.mp3');
                    try {
                        const recognizeResponse = await fetch(recognize_URL, { method: 'POST', body: formData });
                        if (!recognizeResponse.ok) {
                            throw new Error('Failed to recognize audio');
                        }
                        const recognizedText = await recognizeResponse.text();
                        this.setState({ question: recognizedText });
                        const generateResponse = await fetch(generate_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scripts: recognizedText }) });
                        if (!generateResponse.ok) {
                            throw new Error('Failed to generate answer');
                        }
                        const generatedText = await generateResponse.text();
                        this.setState({ answer: generatedText });
                    } catch (error) {
                        console.error('Error occurred:', error);
                    }
                };
            })
            .catch((err) => {
                console.log('Permission Denied for Audio Recording: ', err);
            });
    }

    recordStart = () => {
        this.audioChunks = [];
        this.mediaRecorder.start();
        this.setState({ question: 'Recording...' });
    }

    recordStop = () => {
        this.mediaRecorder.stop();
    }

    render() {
        return (
            <div className="conversation">
                <div className="question">
                    <p>{this.state.question}</p>
                </div>
                <div className="answer">
                    <p>{this.state.answer}</p>
                </div>
                <button onClick={this.recordStart}>Start Recording</button>
                <button onClick={this.recordStop}>Stop Recording</button>
            </div>
        );
    }
}