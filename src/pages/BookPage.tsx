
import Layout from '@/components/Layout';
import BookingForm from '@/components/BookingForm';

const BookPage = () => {
  return (
    <Layout>
      <div className="page-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Book a Parking Slot</h1>
          <p className="text-muted-foreground mt-2">
            Reserve your parking spot in advance
          </p>
        </div>
        
        <BookingForm />
      </div>
    </Layout>
  );
};

export default BookPage;
