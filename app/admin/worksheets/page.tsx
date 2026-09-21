import { redirect } from 'next/navigation';

export default function WorksheetsPage() {
  redirect('/?step=Import&importSource=tsv&admin=true');
}
