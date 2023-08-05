import Image from 'next/image';

const EmptyState = () => {
  return (
    <div className={`pt-10 flex flex-col items-center justify-center space-y-3`}>
      <div className={'relative w-60 h-60'}>
        <Image src={'/empty.png'} alt={'Empty'} fill className={'grayscale'} />
      </div>
        <p className={'text-sm text-muted-foreground'}>
            No companions found.
        </p>
    </div>
  );
};

export default EmptyState;
