import React, { useState, useEffect, useRef } from 'react';
import './ChatBot.css';
import chatBotIcon from '../../assets/icons/chatbot-icon.png';
import logo from '../../assets/icons/logo2.png';
import loudspeaker from '../../assets/icons/loudspeaker.png';

// 서버 URL 설정
const getServerUrl = () => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3001/webhook';
    } else if (hostname === '10.10.10.169') {
        return 'http://10.10.10.169:3001/webhook';
    }
};

const SERVER_URL = getServerUrl();

const ChatBot = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const chatWindowRef = useRef(null);

    const toggleModal = () => {
        if (isModalOpen) {
            setMessages([]);
            setInput('');
        } else {
            sendGreetingMessage();
        }
        setIsModalOpen(!isModalOpen);
    };

    const sendGreetingMessage = async () => {
        const greeting = "안녕하세요 찜꽁테이블 챗봇입니다! 궁금한 점을 물어보세요.";
        const newMessages = [...messages, { user: false, text: greeting }];
        setMessages(newMessages);
    };

    const sendMessage = async () => {
        if (input.trim() === '') return;

        const newMessages = [...messages, { user: true, text: input }];
        setMessages(newMessages);
        setInput(''); 

        console.log('Sending message: ', input); 

        try {
            const response = await fetch(SERVER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: input })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Received response:', data); 
            setMessages([...newMessages, { user: false, text: data.fulfillmentText }]);

        } catch (error) {
            console.error('Error:', error); 
            setMessages([...newMessages, { user: false, text: '서버와의 통신에 문제가 발생했습니다. 다시 시도해주세요.' }]);
        }
    };

    // 스크롤 위치 맨 아래로 이동
    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <>
            <div className="chatbot-icon" onClick={toggleModal}>
                <img src={chatBotIcon} alt="ChatBot" />
            </div>
           
            {isModalOpen && (
                <div className="modal" onClick={toggleModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <span className="close" onClick={toggleModal}>&times;</span>
                        <div className="header">
                            <img src={logo} alt="Logo" />
                        </div>
                        <div className="subheader">
                            <img src={loudspeaker} alt="Loudspeaker" />
                            <p>맛집을 찜하다, 찜꽁테이블 챗봇입니다.</p>
                        </div>
                        <div className="chat-window" ref={chatWindowRef}>
                            {messages.map((message, index) => (
                                <div key={index} className="message-container">
                                    <div className={message.user ? 'user-message' : 'bot-message'}>
                                        {message.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="input-container">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                            />
                            <button onClick={sendMessage}>전송</button>
                        </div>
                    </div>
                </div>
                
            )}
            
        </>
    );
};

export default ChatBot;
