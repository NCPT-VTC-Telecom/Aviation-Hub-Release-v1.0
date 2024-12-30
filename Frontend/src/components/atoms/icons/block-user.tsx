interface Props {
  className?: string;
  fill?: string;
}

function IconBlockUser({ className, fill }: Props) {
  return (
    <>
      <svg id="_6" data-name="6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
        <defs>
          <clipPath id="clippath">
            <circle style={{ fill: 'none' }} cx="12" cy="12" r="10" />
          </clipPath>
        </defs>
        <g clipPath={'url(#clippath)'}>
          <g>
            <rect strokeWidth="0px" style={{ fill: '#acbbb9' }} x="8.42" y="15.21" width="6.71" height="1.83" />
            <path
              strokeWidth="0px"
              style={{ fill: '#ffa47c' }}
              d="m6.35,18.52c-.35-.22-.66-.36-.94-.43.23.79.26,2.07.2,3.36h1c.47-1.31.56-2.42-.26-2.93Z"
            />
            <path
              strokeWidth="0px"
              style={{ fill: '#ffbd95' }}
              d="m17.71,18.49c-.82.52-.72,1.63-.24,2.96h.85c-.06-1.27-.03-2.54.18-3.35-.24.08-.5.21-.79.39Z"
            />
            <path
              strokeWidth="0px"
              style={{ fill: fill }}
              d="m4.72,17.29c-.75,0-1.69,1.45-2.6,3.34-.18.38.09.82.51.82h2.98c.06-1.29.03-2.57-.2-3.36-.14-.49-.36-.79-.69-.79Z"
            />
            <path
              strokeWidth="0px"
              style={{ fill: '#bac2c5' }}
              d="m13.96,12.04c.02-.94-3.98-1.05-3.99-.11-.06,3.49-1.21,4.2-1.21,4.2,0,0-.12,3.1.71,5.32h1.7l.16-1.75h.89l.14,1.75h1.77c.75-2.22.65-5.32.65-5.32,0,0-.91-.35-.83-4.09Z"
            />
            <path
              strokeWidth="0px"
              style={{ fill: fill }}
              d="m19.21,17.23c-.34,0-.57.34-.71.87-.21.81-.24,2.08-.18,3.35h3.01c.42,0,.69-.44.51-.82-.92-1.92-1.87-3.4-2.64-3.4Z"
            />
            <path
              strokeWidth="0px"
              style={{ fill: fill }}
              d="m11.78,18.02l.04,3.43h7.26c.2-2.28.35-4.08.35-4.08l-4.64-1.23c-.64,1.21-3.01,1.89-3.01,1.89Z"
            />
            <path strokeWidth="0px" style={{ fill: fill }} d="m8.76,16.13l-4.5,1.35s.19,1.75.45,3.97h7.11l-.04-3.43s-1.76-.55-3.01-1.89Z" />
            {/* <polygon strokeWidth="0px" style={{ fill: '#acbbb9' }} points="11.24 17.37 10.63 17.63 11.78 18.02 11.52 17.47 11.24 17.37" />
            <polygon strokeWidth="0px" style={{ fill: '#b3bdbf' }} points="11.78 19.7 12.22 19.7 12.92 17.69 11.78 18.02 11.78 19.7" />
            <polygon strokeWidth="0px" style={{ fill: '#b3bdbf' }} points="11.33 19.7 11.78 19.7 11.78 18.02 10.63 17.69 11.33 19.7" />
            <polygon strokeWidth="0px" style={{ fill: '#616d79' }} points="7.38 16.55 10.63 18.87 11.52 17.47 8.42 15.21 7.38 16.55" />
            <polygon strokeWidth="0px" style={{ fill: '#acbbb9' }} points="12.04 17.47 11.78 18.02 12.92 17.63 12.3 17.37 12.04 17.47" />
            <polygon strokeWidth="0px" style={{ fill: '#616d79' }} points="12.04 17.47 12.92 18.87 16.18 16.55 15.13 15.21 12.04 17.47" />
            <polygon strokeWidth="0px" style={{ fill: '#b3bdbf' }} points="11.78 19.7 11.77 21.45 12.37 21.45 12.22 19.7 11.78 19.7" />
            <polygon strokeWidth="0px" style={{ fill: '#b3bdbf' }} points="11.18 21.45 11.77 21.45 11.78 19.7 11.33 19.7 11.18 21.45" /> */}
            <path
              strokeWidth="0px"
              style={{ fill: '#b6bdc5' }}
              d="m11.83,4.38c-2.13,0-4.14,2.26-3.86,5.01.3,2.91,2.41,5.21,3.86,5.21s3.54-2.34,3.86-5.21c.3-2.75-1.73-5.01-3.86-5.01Z"
            />
          </g>
        </g>
        <path
          strokeWidth="0px"
          style={{ fill: fill }}
          d="m19.71,4.21c-2.07-2.07-4.82-3.21-7.75-3.21s-5.68,1.14-7.75,3.21C2.14,6.28,1,9.03,1,11.96s1.14,5.68,3.21,7.75c2.07,2.07,4.82,3.21,7.75,3.21s5.68-1.14,7.75-3.21c2.07-2.07,3.21-4.82,3.21-7.75s-1.14-5.68-3.21-7.75Zm-14.23,14.23c-1.73-1.73-2.68-4.03-2.68-6.48,0-2.15.73-4.18,2.08-5.81l12.9,12.9c-1.64,1.35-3.67,2.08-5.81,2.08-2.45,0-4.75-.95-6.48-2.68Zm13.56-.67L6.15,4.88c1.64-1.35,3.67-2.08,5.81-2.08,2.45,0,4.75.95,6.48,2.68,1.73,1.73,2.68,4.03,2.68,6.48,0,2.15-.73,4.18-2.08,5.81Z"
        />
      </svg>
    </>
  );
}

export default IconBlockUser;
