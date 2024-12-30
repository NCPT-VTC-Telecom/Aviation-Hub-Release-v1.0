interface Props {
  className?: string;
  fill?: string;
}

function IconFlight({ className, fill }: Props) {
  return (
    <svg id="_6" data-name="6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
      <rect style={{ fill: fill }} x="8.49" y="21.18" width="12.26" height="1.82" />
      <path
        style={{ fill: fill }}
        d="M22.82,9.73a1.31,1.31,0,0,0-.38-.36,12.48,12.48,0,0,0-3-.69,8,8,0,0,0-4.24,1.45l-1.69,1h0l-6-1a.45.45,0,0,0-.28,0l-.94.43a.31.31,0,0,0,0,.55L10.22,13a0,0,0,0,1,0,.05L6.13,15.5l-.06,0a3.52,3.52,0,0,1-2.54.38l-2.11-.48a.58.58,0,0,0-.32,0,.54.54,0,0,0-.19.9l2.37,2.17a1.3,1.3,0,0,0,1.37.24l1.17-.47,6.69-2.82,9.44-4C22.89,11.13,23.25,10.36,22.82,9.73Z"
      />
      <path style={{ fill: fill }} d="M14.29,15.59l-2.8,1.17L11,19.08a.21.21,0,0,0,.21.26h.27a1.09,1.09,0,0,0,.93-.51Z" />
    </svg>
  );
}

export default IconFlight;
