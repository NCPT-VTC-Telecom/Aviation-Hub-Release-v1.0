interface Props {
  className?: string;
  fill?: string;
}

function IconFacebook({ className, fill }: Props) {
  return (
    <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M6.04102 0.125034C3.96989 0.125034 2.29102 1.80391 2.29102 3.87503V5.75003H0.0410156V8.75003H2.29102V15.875H5.29102V8.75003H7.91602L8.29102 5.75003H5.29102V4.25003C5.29102 3.42166 5.96264 2.75003 6.79102 2.75003H8.29102V0.245784C7.57514 0.171909 6.76139 0.123534 6.04102 0.125034Z"
        fill="#4267B2"
      />
    </svg>
  );
}

export default IconFacebook;
