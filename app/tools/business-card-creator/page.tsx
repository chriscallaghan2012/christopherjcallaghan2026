import { redirect } from 'next/navigation';

/** Temporarily withdrawn from production while the Business Card Studio is repaired.
 * The full implementation is preserved on chore/unlist-business-card-studio.
 */
export default function BusinessCardCreatorPage() {
  redirect('/tools');
}
