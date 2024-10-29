import React, { useState, useEffect, useRef } from 'react';
import './ChatBot.css';
import chatBotIcon from '../../assets/icons/chatbot-icon.png';
import logo from '../../assets/icons/logo2.png';
import loudspeaker from '../../assets/icons/loudspeaker.png';

const getServerUrl = () => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3001/webhook';
    } else if (hostname === '10.10.10.227') {
        return 'http://10.10.10.227:3001/webhook';
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

    const sendGreetingMessage = () => {
        const greeting = {
            text: "안녕하세요 찜꽁테이블 챗봇입니다! 궁금한 점을 물어보세요.",
            options: ["회원가입", "예약방법", "예약쿠폰", "추첨권"]
        };
        setMessages([...messages, { user: false, ...greeting }]);
    };

    const sendMessage = async (messageText) => {
        const newMessages = [...messages, { user: true, text: messageText }];
        setMessages(newMessages);
        setInput('');

        try {
            const response = await fetch(SERVER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: messageText })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setMessages([...newMessages, { user: false, text: data.fulfillmentText }]);
        } catch (error) {
            setMessages([...newMessages, { user: false, text: '서버와의 통신에 문제가 발생했습니다. 다시 시도해주세요.' }]);
        }
    };

    const handleButtonClick = (messageText) => {
        sendMessage(messageText);
    };

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <>
            <div className="chat-chatbot-icon" onClick={toggleModal}>
                <img src={chatBotIcon} alt="ChatBot" />
            </div>

            {isModalOpen && (
                <div className="chat-modal-chat" onClick={toggleModal}>
                    <div className="chat-modal-content-chat" onClick={(e) => e.stopPropagation()}>
                        <span className="chat-close" onClick={toggleModal}>&times;</span>
                        <div className="chat-header">
                            <img src={logo} alt="Logo" />
                        </div>
                        <div className="chat-subheader">
                            <img src={loudspeaker} alt="Loudspeaker" />
                            <p>맛집을 찜하다, 찜꽁테이블 챗봇입니다.</p>
                        </div>
                        <div className="chat-chat-window" ref={chatWindowRef}>
                            {messages.map((message, index) => (
                                <div key={index} className="chat-message-container">
                                    <div className={message.user ? 'chat-user-message' : 'chat-bot-message'}>
                                        {message.text}
                                        {/* 버튼들이 메시지와 함께 표시되도록 */}
                                        {!message.user && message.options && (
                                            <div className="chat-option-buttons">
                                                {message.options.map((option, idx) => (
                                                    <button
                                                        key={idx}
                                                        className="chat-option-button"
                                                        onClick={() => handleButtonClick(option)}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="chat-input-container">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                            />
                            <button onClick={() => sendMessage(input)}>전송</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBot;
