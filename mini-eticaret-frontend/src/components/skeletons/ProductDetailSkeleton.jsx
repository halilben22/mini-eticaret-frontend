import { Row, Col, Card, Placeholder, Container } from 'react-bootstrap';

export default function ProductDetailSkeleton() {
    return (
        <Container className="py-4" style={{ minHeight: "75vh" }}>
            <Row>
                {/* SOL: Büyük Resim Kutusu */}
                <Col md={6} className="mb-4">
                    <div className="bg-light rounded-3 w-100 placeholder-wave" style={{ height: "400px" }}></div>
                </Col>


                <Col md={6}>

                    <Placeholder as="div" animation="glow" className="mb-2">
                        <Placeholder xs={3} size="lg" bg="secondary" />
                    </Placeholder>


                    <Placeholder as="h1" animation="glow" className="mb-3">
                        <Placeholder xs={8} />
                    </Placeholder>


                    <Placeholder as="h2" animation="glow" className="mb-4">
                        <Placeholder xs={4} />
                    </Placeholder>


                    <Placeholder as="p" animation="glow">
                        <Placeholder xs={12} />
                        <Placeholder xs={12} />
                        <Placeholder xs={8} />
                    </Placeholder>
                    <div className="mt-4 p-3 bg-light rounded placeholder-wave" style={{ height: "80px" }}></div>
                </Col>
            </Row>
        </Container>
    );
}