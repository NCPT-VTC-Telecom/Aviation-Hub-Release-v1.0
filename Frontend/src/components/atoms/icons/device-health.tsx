interface Props {
  className?: string;
  fill?: string;
}

function IconDeviceHealth({ className, fill }: Props) {
  return (
    <svg id="_6" data-name="6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <path style={{ fill: fill }} d="M22.65,17.22H1.35V2.13h21.3Z" />
      <rect style={{ fill: fill }} x="10.15" y="19.06" width="3.7" height="3.38" />
      <path
        style={{ fill: '#bfc4c8' }}
        d="M23.68,2.07A1.07,1.07,0,0,0,22.6,1H1.39A1.07,1.07,0,0,0,.32,2.07V18.52A1.07,1.07,0,0,0,1.4,19.59H22.6a1.07,1.07,0,0,0,1.08-1.07Zm-1,15.15H1.35V2.13h21.3Z"
      />
      <path style={{ fill: fill }} d="M21.84,18.74h-1a.34.34,0,0,1,0-.68h1a.34.34,0,0,1,0,.68Z" />
      <path style={{ fill: fill }} d="M17,22.14H7a1.3,1.3,0,0,0-1.31,1.31H18.32A1.3,1.3,0,0,0,17,22.14Z" />
      <path
        style={{
          fill: '#bac2c5',
          stroke: '#bac2c5',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: '0.74px'
        }}
        d="M14.46,15.72h0a.21.21,0,0,1-.19-.2L13,5.85l-1,7.49a.23.23,0,0,1-.2.2.24.24,0,0,1-.24-.15l-.67-1.74L10.37,13a.24.24,0,0,1-.21.15h0A.25.25,0,0,1,9.94,13L9,10.48H8.46l-.4,1.76a.22.22,0,0,1-.22.17H2.42a.22.22,0,0,1-.22-.22A.22.22,0,0,1,2.42,12H7.66l.4-1.76A.23.23,0,0,1,8.28,10h.88a.24.24,0,0,1,.21.15l.79,2.1L10.7,11a.25.25,0,0,1,.22-.14.24.24,0,0,1,.21.15l.55,1.43L12.75,4a.23.23,0,0,1,.23-.2h0a.23.23,0,0,1,.22.2l1.37,10.52.92-2.45A.23.23,0,0,1,15.7,12h5.88a.22.22,0,0,1,.22.23.22.22,0,0,1-.22.22H15.86l-1.19,3.17A.23.23,0,0,1,14.46,15.72Z"
      />
    </svg>
  );
}

export default IconDeviceHealth;
