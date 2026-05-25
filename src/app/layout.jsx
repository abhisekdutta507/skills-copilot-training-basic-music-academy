import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/style.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BootstrapClient from '../components/BootstrapClient';
import QueryProvider from '../components/QueryProvider';

export const metadata = {
    title: 'Basic Music Academy',
    description:
        'Explore instrument classes, compare monthly fees in INR, book demo lessons, and register for music academy programs.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Manrope:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <BootstrapClient />
                <QueryProvider>
                    <Navbar />
                    <main>{children}</main>
                    <Footer />
                </QueryProvider>
            </body>
        </html>
    );
}
