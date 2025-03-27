import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader";
import Message from "../Message";
import Skill from "../Skill";

function Settings() {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const accessToken = userInfo?.access;
    const [error, setError] = useState();
    const [loading, setLoading] = useState();
    const [skillsModalOpen, setSkillsModalOpen] = useState(false);
    const [availableSkills, setAvailableSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [mainInfo, setMainInfo] = useState({
        image: "",
        name: "",
        rating: 0,
        skills: [],
        documents: [],
    });
    const [name, setName] = useState("");
    const [isUpdatingName, setIsUpdatingName] = useState(false);

    const [selectedDocument, setSelectedDocument] = useState(null); // Для модального окна документа
    const [docModalOpen, setDocModalOpen] = useState(false); // Состояние открытия модального окна
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const { data: mainData } = await axios.get(`/profile/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setMainInfo(mainData);
                setName(mainData.name);
            } catch (error) {
                setError(error.response?.data?.detail || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    useEffect(() => {
        if (error) {
            navigate("/login");
        }
    }, [error]);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("image", file);

            try {
                setLoading(true);
                const { data } = await axios.post(
                    "/profile/update/",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                setMainInfo((prev) => ({
                    ...prev,
                    image: data.image,
                }));
            } catch (error) {
                console.error(
                    "Error uploading image:",
                    error.response?.data || error.message
                );
            } finally {
                setLoading(false);
            }
        }
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleNameSave = async () => {
        if (!name.trim()) {
            alert("Имя не может быть пустым!");
            return;
        }
        try {
            setLoading(true);
            setIsUpdatingName(true);
            const { data } = await axios.post(
                "/profile/update/",
                { name },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            setMainInfo((prev) => ({
                ...prev,
                name: data.name,
            }));
        } catch (error) {
            console.error(
                "Error updating name:",
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
            setIsUpdatingName(false);
        }
    };

    const openSkillsModal = async () => {
        try {
            const { data } = await axios.get("/search/skills/get/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setAvailableSkills(data);
            setSkillsModalOpen(true);
        } catch (error) {
            console.error("Error loading skills:", error.response?.data || error.message);
        }
    };

    const closeSkillsModal = () => {
        setSkillsModalOpen(false);
    };

    const toggleSkillSelection = (id) => {
        setSelectedSkills((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((skillId) => skillId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSkillsSave = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                "/profile/update/",
                { skills: selectedSkills },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            setMainInfo((prev) => ({
                ...prev,
                skills: data.skills,
            }));
            setSkillsModalOpen(false);
        } catch (error) {
            console.error("Error updating skills:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDocumentOpen = (doc) => {
        setSelectedDocument(doc);
        setDocModalOpen(true);
    };

    const handleDocumentDelete = async () => {
        try {
            setLoading(true);
            await axios.post(`profile/document/${selectedDocument.id}/delete/`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setMainInfo((prevState) => ({
                ...prevState,
                documents: prevState.documents.filter(
                    (doc) => doc.id !== selectedDocument.id
                ),
            }));
            setSelectedDocument(null);
            setDocModalOpen(false);
        } catch (error) {
            console.error(
                "Error deleting document:",
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            alert('Выберите файл для загрузки!');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            setLoading(true);
            const response = await axios.put(
                "/profile/document/upload/",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            const uploadedDocument = response.data;

            console.log("Uploaded document:", uploadedDocument);
            setMainInfo((prevMainInfo) => ({
                ...prevMainInfo,
                documents: [...prevMainInfo.documents, uploadedDocument],
            }));

            setSelectedFile(null); // Сброс выбранного файла

        } catch (error) {
            console.error(
                "Error uploading image:",
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container>
            <br />
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <div style={{ display: "flex" }}>
                    <div style={{ flex: 2 }}>
                        <div style={{ display: "flex", gap: "3vw" }}>
                            <div
                                style={{
                                    width: "min(30vh, 30vw)",
                                    height: "min(30vh, 30vw)",
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    border: "3px solid var(--secondary-color)",
                                    position: "relative",
                                    cursor: "pointer",
                                }}
                                onClick={() =>
                                    document.getElementById("imageInput").click()
                                }
                            >
                                <img
                                    src={mainInfo.image}
                                    alt="Profile"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        filter: "brightness(70%)",
                                    }}
                                />
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        color: "#fff",
                                        fontWeight: "bold",
                                        fontSize: "1.2rem",
                                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                                    }}
                                >
                                    Изменить фото
                                </div>
                            </div>
                            <input
                                type="file"
                                id="imageInput"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                            <div>
                                <Form.Group controlId="name">
                                    <Form.Label>Имя:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={name}
                                        onChange={handleNameChange}
                                        placeholder="Введите ваше имя"
                                    />
                                </Form.Group>
                                <Button
                                    variant="primary"
                                    onClick={handleNameSave}
                                    disabled={isUpdatingName}
                                    style={{ marginTop: "10px" }}
                                >
                                    {isUpdatingName ? "Сохранение..." : "Сохранить имя"}
                                </Button>
                            </div>
                        </div>
                        <Card
                            className="my-3 p-3 rounded"
                            style={{
                                backgroundColor: "var(--bs-light)",
                                width: "70%",
                                minHeight: "8vh",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "10px",
                                }}
                            >
                                {mainInfo.skills.map((skill) => (
                                    <Skill key={skill.id} skill={skill} />
                                ))}
                            </div>
                        </Card>
                        <Button
                            variant="primary"
                            onClick={openSkillsModal}
                            style={{ marginBottom: "10px" }}
                        >
                            Редактировать навыки
                        </Button>
                        <Modal show={skillsModalOpen} onHide={closeSkillsModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Редактировать навыки</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {availableSkills.map((skill) => (
                                    <Form.Check
                                        key={skill.id}
                                        type="checkbox"
                                        label={skill.name}
                                        checked={selectedSkills.includes(skill.id)}
                                        onChange={() => toggleSkillSelection(skill.id)}
                                    />
                                ))}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={closeSkillsModal}>
                                    Закрыть
                                </Button>
                                <Button variant="primary" onClick={handleSkillsSave}>
                                    Сохранить изменения
                                </Button>
                            </Modal.Footer>
                        </Modal>
                        <Row>
                            {mainInfo.documents.map((document) => (
                                <Col key={document.id} sm={12} md={6} lg={4} xl={3}>
                                    <Card
                                        className="p-3 my-2"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleDocumentOpen(document)}
                                    >
                                        <Card.Img
                                            variant="top"
                                            src={document.image}
                                            style={{
                                                height: "200px",
                                                objectFit: "cover",
                                                borderRadius: "0px",
                                            }}
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        <Row className="mt-4">
                        <Col>
                            <Form.Group>
                                <Form.Control type="file" onChange={handleFileSelect} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Button
                                variant="primary"
                                onClick={handleFileUpload}
                                disabled={!selectedFile}
                            >
                                Загрузить документ
                            </Button>
                        </Col>
                    </Row>
                    </div>
                </div>
            )}

            <Modal show={docModalOpen} onHide={() => setDocModalOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Действия с документом</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Вы хотите удалить или открыть документ?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={() => handleDocumentDelete()}
                    >
                        Удалить
                    </Button>
                    <Button
                    variant="primary"
                    onClick={() => {
                        const newTab = window.open();
                        if (newTab) {
                            newTab.location = selectedDocument.image;
                        } else {
                            console.error("Браузер заблокировал попытку открытия новой вкладки.");
                        }
                    }}
                    >
                    Открыть в новой вкладке
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Settings;