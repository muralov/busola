import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { FlexBox, Icon, Input } from '@ui5/webcomponents-react';
import { spacing } from '@ui5/webcomponents-react-base';
import { initialPromptState } from 'components/AIassistant/state/initalPromptAtom';
import Message from './messages/Message';
import Bubbles from './messages/Bubbles';
import ErrorMessage from './messages/ErrorMessage';
import getChatResponse from 'components/AIassistant/api/getChatResponse';
import './Chat.scss';

export default function Chat({ isFullScreen }) {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [errorOccured, setErrorOccured] = useState(false);
  const initialPrompt = useRecoilValue(initialPromptState);

  const addMessage = (author, messageChunks, isLoading) => {
    setChatHistory(prevItems =>
      prevItems.concat({ author, messageChunks, isLoading }),
    );
  };

  const handleSuccess = response => {
    setChatHistory(prevMessages => {
      const [latestMessage] = prevMessages.slice(-1);
      return prevMessages.slice(0, -1).concat({
        author: 'ai',
        messageChunks: latestMessage.messageChunks.concat(response),
        isLoading: response?.step !== 'output',
      });
    });
  };

  const handleError = () => {
    setErrorOccured(true);
    setChatHistory(prevItems => prevItems.slice(0, -2));
  };

  const sendPrompt = prompt => {
    setErrorOccured(false);
    addMessage('user', [{ step: 'output', result: prompt }], false);
    getChatResponse({ prompt, handleSuccess, handleError });
    addMessage('ai', [], true);
  };

  const onSubmitInput = () => {
    if (inputValue.length === 0) return;
    const prompt = inputValue;
    setInputValue('');
    sendPrompt(prompt);
  };

  const scrollToBottom = () => {
    if (containerRef?.current?.lastChild)
      containerRef.current.lastChild.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
  };

  useEffect(() => {
    if (chatHistory.length === 0) sendPrompt(initialPrompt);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const delay = errorOccured ? 500 : 0;
    setTimeout(() => {
      scrollToBottom();
    }, delay);
  }, [chatHistory, errorOccured]);

  return (
    <FlexBox
      direction="Column"
      justifyContent="SpaceBetween"
      className="chat-container"
    >
      <div
        className="chat-list"
        style={spacing.sapUiTinyMargin}
        ref={containerRef}
      >
        {chatHistory.map((message, index) => {
          return message.author === 'ai' ? (
            <>
              <Message
                key={index}
                className={`left-aligned${isFullScreen ? ' fullscreen' : ''}`}
                messageChunks={message.messageChunks}
                isLoading={message.isLoading}
              />
              {index === chatHistory.length - 1 && !message.isLoading && (
                <Bubbles
                  key={index + '.2'}
                  className={isFullScreen ? 'fullscreen' : ''}
                  onClick={sendPrompt}
                  suggestions={
                    message.suggestions ?? [
                      'What is the meaning of life?',
                      'Where to buy cheap bitcoins?',
                      'What should I do next?',
                    ]
                  }
                />
              )}
            </>
          ) : (
            <Message
              key={index}
              className={`right-aligned${isFullScreen ? ' fullscreen' : ''}`}
              messageChunks={message.messageChunks}
            />
          );
        })}
        {errorOccured && (
          <ErrorMessage
            errorOnInitialMessage={chatHistory.length === 0}
            resendInitialPrompt={() => sendPrompt(initialPrompt)}
          />
        )}
      </div>
      <div style={spacing.sapUiTinyMarginBeginEnd}>
        <Input
          className="full-width"
          disabled={chatHistory[chatHistory.length - 1]?.isLoading}
          placeholder={t('ai-assistant.placeholder')}
          value={inputValue}
          icon={<Icon name="paper-plane" onClick={onSubmitInput} />}
          onKeyDown={e => e.key === 'Enter' && onSubmitInput()}
          onInput={e => setInputValue(e.target.value)}
        />
      </div>
    </FlexBox>
  );
}
