import { Card, Placeholder, Button } from 'react-bootstrap';

export default function ProductSkeleton() {
    return (
        <Card className="shadow-sm h-100 border-0">
            {/* Resim Alanı İskeleti */}
            <div style={{ height: "200px", background: "#e9ecef" }} className="w-100 placeholder-wave" />

            <Card.Body className="d-flex flex-column">
                {/* Başlık İskeleti (glow animasyonu ile) */}
                <Placeholder as={Card.Title} animation="glow">
                    <Placeholder xs={10} />
                </Placeholder>

                {/* Fiyat ve Buton İskeleti */}
                <div className="mt-auto d-flex justify-content-between align-items-center pt-3">
                    {/* Fiyat yerine kutu */}
                    <Placeholder.Button variant="primary" xs={4} aria-hidden="true" style={{ opacity: 0.3 }} />

                    {/* Buton yerine kutu */}
                    <Placeholder.Button variant="secondary" xs={3} aria-hidden="true" />
                </div>
            </Card.Body>
        </Card>
    );
}