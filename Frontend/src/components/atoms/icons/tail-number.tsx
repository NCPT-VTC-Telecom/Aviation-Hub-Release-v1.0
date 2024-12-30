interface Props {
  className?: string;
  fill?: string;
}

function IconTailNumber({ className, fill }: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} height="24px" viewBox="0 -960 960 960" width="24px" fill={fill}>
      <path d="M232-240h462l90-480H562L232-240ZM80-160l440-640h360L760-160H80Zm500-240q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29ZM232-240h462-462Z" />
    </svg>
  );
}

export default IconTailNumber;
