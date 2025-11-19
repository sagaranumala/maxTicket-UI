import Events from "./(pages)/components/Events";
import Protected from "./(pages)/components/Protected";


export default function EventsPage() {
  return (
    <Protected>
      <Events />
    </Protected>
  );
}
