import './App.css';
import {useEffect, useState} from "react";
import webSocketService from './WebSocketService';



function App() {
    const [selectedOption, setSelectedOption] = useState(1);
    const [users, setUsers] = useState(null);
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [response, setResponse] = useState('');

    useEffect(() => {
        const map = new Map();
        map.set(1, {
            id: 1,
            name: "admin",
            cookie: "tr-archive-local=eyJpdiI6InZmTjJob3hMRVUwaGhKeGIwRFJibEE9PSIsInZhbHVlIjoia3dQK2FBeVdQSEZXOFR3WisrTWR3UHpUaUQ3dStEMklpQ0NhWFBzRVN0K0ZtU1E5VnA5V3hEUnQ5bURJZ3h6YVZXZUM2Z2FOUzNuK2M3K28ydXBKdGZ4Yk84N2xtdzZXTjlzTFkyS2JRTWl6TmV5aEl5Nlc1TjRPRkMrOE1yS04iLCJtYWMiOiI4MmNkOWI5OWNlNmE0NzUwNmQ2MmFjZGVhM2JlZTc2ZDZiZDUyYjQ0NDdhNTIyZmY2NzZmNDczMGRkMzZlYTI1IiwidGFnIjoiIn0=; Path=/; Expires=Wed, 05 Jun 2025 09:25:08 GMT;",
            // cookie: "tr-archive-local=eyJpdiI6IlRLQ29LV3I5Qk84dERiRXlHckc4aHc9PSIsInZhbHVlIjoib3hzUEpUTGFNRFVJcVpLUHlvOVI5QjFTMHFPN1hhZDJUZndPS1FQUUNVZU9ocWdFMkVDT2ZKL0lTbUg4UFFzTXlKOUlPWU5jTnZmOUhoTlVEdXJPRWJhL2t5Z0ZIWUFaVE1CTm9McThFSi9TMlJMUGZ1L09IaTY4ZGtaUUFlNnYiLCJtYWMiOiJkMmM3ZmQ3NGRmZjg2NTA2YTY5ZjlmYzU5OGFkMjNkOTJiZTYxNjE4MDk5MzIwZWYxYTgyNDVlODIxMzI5N2Y3IiwidGFnIjoiIn0=; Path=/; Expires=Wed, 05 Jun 2025 09:25:08 GMT;",
        })
        map.set(2, {
            id: 2,
            name: "user",
            cookie: "tr-archive-local=eyJpdiI6IkVpTnVQNGwxeUc3UGRETmpUK3FPT0E9PSIsInZhbHVlIjoiTkJlSXFVdmo4YlU1OXNqYS9QN2NHOE92L0plU29yd3Z0SmtLbHM2bHQxWlk3dUdqQ3gwMlZHTHVvY210dmthRmhvQ1VXeU5KN1k5NDA5Ly9xQ1cwU0R0L2hndEc2SDE1eml1YUxDQnJmWGJ1Z2sxeUt0SzF3QlpxZ0F0Tm0yQkwiLCJtYWMiOiIxN2QwYTUyYjA0ZWU3YzdiYjZmNTkxYmFhYjE5N2UxOTNmYzM4MWQyYTJkMWU4NGVkZmY0YjExMzI1YWZlNTcxIiwidGFnIjoiIn0=; Path=/; Expires=Wed, 05 Jun 2025 09:25:08 GMT;",
        })
        setUsers(map)
    }, [])

    const handleChange = (event) => {
        setSelectedOption(parseInt(event.target.value));
    };

    const connect = () => {
        const onConnected = () => {
            setConnected(true)
            console.log('Connected');
            webSocketService.subscribe('/user/queue/specific', (message) => {
                console.log("GET MESSAGE:", message)
                setMessages((prevMessages) => [...prevMessages, message]);
            });
            webSocketService.subscribe('/topic/events', (message) => {
                console.log("GET EVENT:", message)
            });
        };

        const onError = (error) => {
            console.error('Connection error', error);
        };

        webSocketService.connect(onConnected, onError, users.get(selectedOption).cookie);
    }

    /*const sendPrivateMessage = () => {
        fetch(`http://localhost:8101/tr-archive-notification-service/api/test/web?name=` + (users && users.get(selectedOption == "1" ? 2 : 1).name))
            .then(response => response.text())
            .then(data => setResponse(data))
            .catch(error => console.error('Error:', error));
    };

    const sendMessage = () => {
        // webSocketService.sendMessage('/app/hello', { name: 'Test' });
        // webSocketService.sendPrivateMessage(users && users.get(selectedOption == "1" ? 2 : 1).name);
        sendPrivateMessage()
    };*/

    return <div className="App">
        <div>
            <label>
                <input
                    type="radio"
                    value="1"
                    checked={selectedOption === 1}
                    onChange={handleChange}
                />
                Option {users ? users.get(1).name : ""}
            </label>
        </div>
        <div>
            <label>
                <input
                    type="radio"
                    value="2"
                    checked={selectedOption === 2}
                    onChange={handleChange}
                />
                Option {users ? users.get(2).name : ""}
            </label>
        </div>
        <hr/>
        {connected
            ? <input
                type="button"
                value="Disconnect"
                onClick={() => {
                    webSocketService.disconnect();
                    setConnected(false);
                }}/>
            : <input
                type="button"
                value="Connect"
                onClick={() => {
                    connect()
                }}
            />
        }
        {connected ? <div style={{color: "green"}}>Connected</div> : <div style={{color: "red"}}>Disconnected</div>}

        {connected &&
            <div>
                {/*<button onClick={sendMessage}>Send Message</button>*/}
                <ul>
                    {messages.map((message, index) => (
                        <li key={index}>Msg: #{message.id} {message.description}</li>
                    ))}
                </ul>
            </div>
        }
        <hr/>
        <div>{response}</div>
    </div>
}

export default App;
