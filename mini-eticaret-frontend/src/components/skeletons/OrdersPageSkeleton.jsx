import { Container, Card, Placeholder, Row, Col } from 'react-bootstrap';

export default function OrdersSkeleton() {
    return (
        <Container className="py-5" style={{ maxWidth: "800px" }}>
            <Placeholder as="h1" animation="glow" className="mb-4">
                <Placeholder xs={5} />
            </Placeholder>

            {/* 3 Tane Sipariş Kartı Taklidi */}
            {[1, 2, 3].map((i) => (
                <Card key={i} className="mb-3 border-0 shadow-sm p-3">
                    <Row className="justify-content-between mb-3">
                        <Col xs={4}>
                            <Placeholder as="div" animation="glow">
                                <Placeholder xs={8} />
                                <Placeholder xs={6} />
                            </Placeholder>
                        </Col>
                        <Col xs={3} className="text-end">
                            <Placeholder.Button xs={10} variant="secondary" size="sm" />
                        </Col>
                    </Row>
                    <Placeholder as="div" animation="glow" className="mb-2">
                        <Placeholder xs={12} />
                        <Placeholder xs={12} />
                    </Placeholder>
                    <hr />
                    <div className="text-end">
                        <Placeholder as="h4" animation="glow">
                            <Placeholder xs={3} />
                        </Placeholder>
                    </div>
                </Card>
            ))}
        </Container>
    );
}