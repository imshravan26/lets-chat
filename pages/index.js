import Head from "next/head";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <div className="w-full h-full md:block flex items-center justify-center">
      <Head>
        <title>Let's chat</title>
        <meta name="description" content="Let's start chatting" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar />
    </div>
  );
}
