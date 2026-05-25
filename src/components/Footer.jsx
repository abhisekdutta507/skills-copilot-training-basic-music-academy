import { useLocation } from 'react-router-dom';

const subtitles = {
    '/enroll': 'This starter stores form submissions in local browser storage.',
    '/classes': 'All fees shown are monthly fees in INR.',
    '/': 'Bootstrap, React, seeded class data.',
};

export default function Footer() {
    const { pathname } = useLocation();
    const subtitle = subtitles[pathname] ?? subtitles['/'];

    return (
        <footer className="academy-footer py-4">
            <div className="container d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
                <p className="mb-0">Basic Music Academy</p>
                <p className="mb-0 text-body-secondary">{subtitle}</p>
            </div>
        </footer>
    );
}
