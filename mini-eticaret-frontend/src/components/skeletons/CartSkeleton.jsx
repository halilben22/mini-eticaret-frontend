import { Container, Row, Col, Card, Placeholder } from 'react-bootstrap';

export default function CartSkeleton() {
    return (
        <Container className="py-5">
            <Placeholder as="h2" animation="glow" className="mb-4">
                <Placeholder xs={4} />
            </Placeholder>

            <Row>
                {/* SOL: Ürün Listesi (3 tane sahte satır) */}
                <Col lg={8}>
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="mb-3 border-0 shadow-sm">
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col xs={3}>
                                        <div className="bg-light rounded placeholder-wave" style={{ height: "80px" }}></div>
                                    </Col>
                                    <Col xs={9}>
                                        <Placeholder as="h5" animation="glow">
                                            <Placeholder xs={8} />
                                        </Placeholder>
                                        <Placeholder as="p" animation="glow">
                                            <Placeholder xs={4} />
                                        </Placeholder>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                </Col>

                {/* SAĞ: Özet Kutusu */}
                <Col lg={4}>
                    <Card className="border-0 shadow-sm p-3">
                        <Placeholder as={Card.Title} animation="glow" className="mb-3">
                            <Placeholder xs={6} />
                        </Placeholder>
                        <Placeholder as="div" animation="glow" className="mb-2">
                            <Placeholder xs={12} size="lg" />
                        </Placeholder>
                        <Placeholder as="div" animation="glow" className="mb-2">
                            <Placeholder xs={12} size="lg" />
                        </Placeholder>
                        <Placeholder.Button variant="success" xs={12} className="mt-3" />
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}