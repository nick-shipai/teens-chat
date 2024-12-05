let recorder;
let audioChunks = [];
let isRecording = false;
let recordingStatusDiv;
let recordingTimer;
let seconds = 0;
let recordingId = 0; 

// Create the recording status div (hidden by default)
recordingStatusDiv = document.createElement('div');
recordingStatusDiv.id = 'recording-status';
recordingStatusDiv.style.display = 'none'; 
recordingStatusDiv.innerHTML = `
    <div id="record-ani"></div>
    <span id="recording-text">Recording...</span>
`;
document.body.appendChild(recordingStatusDiv);

// Handle the 'mousedown' event to start recording
recordIcon.addEventListener('mousedown', async () => {
    if (!isRecording) {
        // Start recording
        isRecording = true;
        audioChunks = [];
        seconds = 0;
        recordingStatusDiv.style.display = 'block';  // Show the recording div
        recordIcon.style.display = 'none'; // Hide the record icon
        sendAudio.style.display = 'block'; // Show the send button
        startRecordingTimer();  // Start the timer to show elapsed time

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        recorder = new MediaRecorder(stream);

        recorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        recorder.onstop = () => {
            // Create the audio file once recording stops
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);

            // Create a new audio element for this recording
            const audioElement = document.createElement('audio');
            audioElement.src = audioUrl;
            audioElement.style.display = 'none';  // Hide the audio element itself

            // Ensure audio is fully loaded before accessing its duration
            audioElement.addEventListener('canplaythrough', () => {
                const totalDuration = Math.floor(audioElement.duration);
                if (totalDuration <= 0) {
                    timestamp.textContent = "0:00";  // Fallback to 0 if duration is invalid
                } else {
                    timestamp.textContent = `${totalDuration}s`;  // Display total duration in seconds
                }
            });

            // Create play/pause buttons for this recording
            const playButton = document.createElement('img');
            playButton.src = 'play.png';
            playButton.alt = 'Play';
            playButton.classList.add('audio-btn', 'play');
            
            const pauseButton = document.createElement('img');
            pauseButton.src = 'pause.png';
            pauseButton.alt = 'Pause';
            pauseButton.classList.add('audio-btn', 'pause');
            pauseButton.style.display = 'none';  // Hide pause button initially

            // Timestamp display for the audio (initially shows total duration in seconds)
            const timestamp = document.createElement('span');
            timestamp.classList.add('audio-timestamp');
            timestamp.style.color = 'black';

            // Audio range slider for this recording
            const audioRange = document.createElement('input');
            audioRange.type = 'range';
            audioRange.classList.add('audio-range');
            audioRange.value = 0;

            // Assign a unique ID for this recording
            recordingId++;
            const uniqueId = `recording-${recordingId}`;

            // Handle play/pause functionality for this recording
            playButton.addEventListener('click', () => {
                if (audioElement.paused) {
                    audioElement.play();
                    playButton.style.display = 'none';  // Hide play button
                    pauseButton.style.display = 'inline';  // Show pause button
                    timestamp.textContent = '0:00';  // Reset timestamp to 0:00 at start
                } else {
                    audioElement.pause();
                    playButton.style.display = 'inline';  // Show play button
                    pauseButton.style.display = 'none';  // Hide pause button
                }
            });

            // Update timestamp and range slider during playback
            audioElement.addEventListener('timeupdate', () => {
                const minutes = Math.floor(audioElement.currentTime / 60);
                const seconds = Math.floor(audioElement.currentTime % 60).toString().padStart(2, '0');
                timestamp.textContent = `${minutes}:${seconds}`;  // Update timestamp during playback
                audioRange.value = (audioElement.currentTime / audioElement.duration) * 100;
            });

            // Handle audio seek via slider
            audioRange.addEventListener('input', () => {
                const seekTime = (audioRange.value / 100) * audioElement.duration;
                audioElement.currentTime = seekTime;
            });

            // Reset play/pause buttons when the audio ends
            audioElement.addEventListener('ended', () => {
                playButton.style.display = 'inline';  // Show play button again
                pauseButton.style.display = 'none';  // Hide pause button again
                timestamp.textContent = `${totalDuration}s`;  // Reset timestamp to total duration at the end
            });

            // Create chat bubble to display the recorded audio with play/pause controls
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('chat-message', 'user');
            messageDiv.id = uniqueId; // Set unique ID for the message
            const chatBubble = document.createElement('div');
            chatBubble.classList.add('chat-bubble', 'user');
            chatBubble.appendChild(playButton);
            chatBubble.appendChild(pauseButton);
            chatBubble.appendChild(timestamp);
            chatBubble.appendChild(audioRange);
            chatBubble.appendChild(audioElement); // Append the hidden audio element

            messageDiv.appendChild(chatBubble);
            chatSpace.appendChild(messageDiv);
            chatSpace.scrollTop = chatSpace.scrollHeight;

            // Hide the recording status once the recording stops
            recordingStatusDiv.style.display = 'none';
        };

        recorder.start();
    }
});

// Handle the 'mouseup' event to stop recording and send
sendAudio.addEventListener('click', () => {
    if (isRecording) {
        // Stop recording (this will trigger the onstop callback)
        isRecording = false;
        recorder.stop();
        
        // Hide sendAudio button and show recordIcon again
        sendAudio.style.display = 'none';
        recordIcon.style.display = 'block';
    }
});

function startRecordingTimer() {
    const recordingTimeElement = document.getElementById('recording-time');
    if (!recordingTimeElement) {
        console.error('The recording-time element was not found!');
        return;
    }

    recordingTimer = setInterval(() => {
        if (isRecording) {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            const formattedTime = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
            recordingTimeElement.textContent = formattedTime;
        } else {
            clearInterval(recordingTimer);
        }
    }, 1000);  // Update every second
}

// Add a fallback for record button if the browser doesn't support media devices
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Your browser does not support audio recording.");
}