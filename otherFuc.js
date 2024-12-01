   // Monitor text selection in the text area
        textArea.addEventListener('select', () => {
            const selectedText = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
            if (selectedText.trim().length > 0) {
                // Show the formatting toolbar
                formattingToolbar.style.display = 'block';
                const rect = textArea.getBoundingClientRect();
                formattingToolbar.style.top = `${rect.top - 30}px`;  // Position the toolbar above the textarea
                formattingToolbar.style.left = `${rect.left + textArea.selectionStart * 7}px`;  // Adjust position based on selection
            }
        });

        // Hide the formatting toolbar if no text is selected
        document.addEventListener('click', (e) => {
            if (!textArea.contains(e.target) && !formattingToolbar.contains(e.target)) {
                formattingToolbar.style.display = 'none';
            }
        });

        // Apply bold formatting
        boldButton.addEventListener('click', () => {
            const selectedText = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
            const boldText = `<b>${selectedText}</b>`;
            textArea.setRangeText(boldText, textArea.selectionStart, textArea.selectionEnd, 'select');
            formattingToolbar.style.display = 'none';
        });

        // Apply italic formatting
        italicButton.addEventListener('click', () => {
            const selectedText = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
            const italicText = `<i>${selectedText}</i>`;
            textArea.setRangeText(italicText, textArea.selectionStart, textArea.selectionEnd, 'select');
            formattingToolbar.style.display = 'none';
        });

        // Apply monospace formatting
        monospaceButton.addEventListener('click', () => {
            const selectedText = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
            const monospaceText = `<code>${selectedText}</code>`;
            textArea.setRangeText(monospaceText, textArea.selectionStart, textArea.selectionEnd, 'select');
            formattingToolbar.style.display = 'none';
        });

        // Monitor typing in the text area
        textArea.addEventListener('input', () => {
            if (textArea.value.trim().length > 0) {
                recordIcon.style.display = 'none';
                if (!document.getElementById('send')) {
                    const sendIcon = document.createElement('img');
                    sendIcon.src = 'send.png';
                    sendIcon.alt = 'Send';
                    sendIcon.id = 'send';
                    recordDiv.appendChild(sendIcon);

                    sendIcon.addEventListener('click', sendMessage);
                }

                slideDiv.style.width = '0';
                textArea.style.width = '190px';
                emojiIcon.style.marginLeft = '5px';
                recordIcon.style.marginLeft = '20px';
                addDiv.style.display = 'flex';
                addButton.style.display = 'block';
            } else {
                const sendIcon = document.getElementById('send');
                if (sendIcon) {
                    sendIcon.remove();
                }
                recordIcon.style.display = 'block';
            }
        });
        
        
        // Handle the "add" button click
        addButton.addEventListener('click', () => {
            slideDiv.style.width = '100px';
            textArea.style.width = '80px';
            emojiIcon.style.marginLeft = '40px';
            recordIcon.style.marginLeft = '30px';
            addButton.style.display = 'none';
        });

        function sendMessage() {
            if (textArea.value.trim().length > 0) {
                const userMessage = textArea.value.trim();
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('chat-message', 'user');
                
                const username = document.createElement('div');
                messageDiv.classList.add('username');
                
                const messageContainer = document.createElement('div');
                messageDiv.classList.add('message-container');
                
                const profileImgCon = document.createElement('div');
                messageDiv.classList.add('profile-image');
                
                const chatBubble = document.createElement('div');
                chatBubble.classList.add('chat-bubble', 'user');
                chatBubble.innerHTML = userMessage; // Use innerHTML to render HTML content
                messageDiv.appendChild(chatBubble);
                chatSpace.appendChild(messageDiv);
                
                textArea.value = '';
                const sendIcon = document.getElementById('send');
                if (sendIcon) {
                    sendIcon.remove();
                }
                recordIcon.style.display = 'block';
                chatSpace.scrollTop = chatSpace.scrollHeight;
            }
        }