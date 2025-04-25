import { fetchPages } from '@/lib/notion';
import LandingPage from '@/components/LandingPage';

export default async function Home() {
  const posts = await fetchPages();
  return <LandingPage />;
}
