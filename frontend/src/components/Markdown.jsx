import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

/** Markdown with syntax-highlighted code blocks, used for every tutor response. */
export default function Markdown({ children }) {
  return (
    <ReactMarkdown
      components={{
        code({ className, children: code, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return match ? (
            <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div">
              {String(code).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {code}
            </code>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
