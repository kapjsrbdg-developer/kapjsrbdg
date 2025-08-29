import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans relative min-h-screen overflow-hidden">
      <main className="relative z-20 flex flex-col gap-[24px] items-center w-full animate-fade-in pt-16">
        <div className="animate-bounce-in w-screen h-screen flex items-center justify-center absolute inset-0 z-10">
          <Image
            className="transition-all duration-500 w-full h-full max-w-none max-h-none object-contain"
            src="/home.svg"
            alt="Home"
            width={1920}
            height={1080}
            priority
            style={{ 
              width: '100vw', 
              height: '100vh', 
              maxWidth: 'none', 
              maxHeight: 'none' 
            }}
          />
        </div>

        {/* <div className="flex gap-4 items-center flex-col sm:flex-row animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>

        </div> */}
      </main>

    </div>
  );
}
