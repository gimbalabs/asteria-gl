import Head from "next/head";
import PlayButton from "~/components/PlayButton";


export default function Home() {

  return (
    <>
      <Head>
        <title>Asteria-GL</title>
        <meta name="Asteria-GL" content="Asteria by Gimbalabs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-galaxy-primary to-[#000000]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Asteria: The Gimbalabs Fork
          </h1>
            <h2 className="text-white text-2xl font-bold">How to Play</h2>
            <p>Some rules here</p>
            <PlayButton />
        </div>
      </main>
    </>
  );
}
