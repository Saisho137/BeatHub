import Layout from "../components/layout";
import Link from 'next/link';
import indexStyles from "../styles/index.module.css";

export default function Home() {

  return (
    <Layout>
      <div className="container mt-5 pt-5">
        <div className="row text-center">
          <div className={`col-md-6 col-sm-12 ${indexStyles.buttonContainer}`}>
            <Link href="/recommender" className={`${indexStyles.homeButton1}`}>Want to find something new?</Link>
          </div>
          <div className={`col-md-6 col-sm-12 ${indexStyles.buttonContainer}`}>
            <Link href="/game" className={`${indexStyles.homeButton1}`}>Want to play a game?</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}