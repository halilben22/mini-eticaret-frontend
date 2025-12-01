import { Card, Placeholder, Button } from 'react-bootstrap';

export default function ProductSkeleton() {
    return (
        <Card className="shadow-sm h-100 border-0">
            {/* Resim Alanı İskeleti */}
            <div style={{ height: "200px", background: "#e9ecef" }} className="w-100 placeholder-wave" />

            <Card.Body className="d-flex flex-column">

                <Placeholder as={Card.Title} animation="glow">
                    <Placeholder xs={10} />
                </Placeholder>

                {/* Fiyat ve Buton İskeleti */}
                <div className="mt-auto d-flex justify-content-between align-items-center pt-3">



                </div>
            </Card.Body>
        </Card>
    );
}