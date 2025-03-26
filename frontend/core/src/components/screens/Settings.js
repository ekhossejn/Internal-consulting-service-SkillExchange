import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader";
import Message from "../Message";
import Skill from "../Skill";
import Document from "../Document";

function Settings() {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const accessToken = userInfo?.access;
    const [image, setImage] = useState(null);
    const [error, setError] = useState();
    const [loading, setLoading] = useState();
    const [skillsModalOpen, setSkillsModalOpen] = useState(false); // Состояние модального окна для редактирования навыков
    const [availableSkills, setAvailableSkills] = useState([]); // Доступные навыки, загружаемые с сервера
    const [selectedSkills, setSelectedSkills] = useState([]); // Локальное состояние для выбранных навыков
    const [mainInfo, setMainInfo] = useState({
        image: "",
        name: "",
        rating: 0,
        skills: [],
        documents: [],
    });

    const [name, setName] = useState("");
    const [isUpdatingName, setIsUpdatingName] = useState(false);

    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            try {
                const { data: mainData } = await axios.get(`/profile/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setMainInfo(mainData);
                setName(mainData.name);
                setSelectedSkills(mainData.skills.map(skill => skill.id)); // Устанавливаем текущие навыки
            } catch (error) {
                setError(error.response?.data?.detail || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
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
                            {/* Блок с фотографией */}
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
                                width: "90%",
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
                        {mainInfo.documents.map((document) => (
                            <Col key={document.id} sm={12} md={6} lg={4} xl={3}>
                                <Document document={document} />
                            </Col>
                        ))}
                    </div>
                </div>
            )}
            {/* Модальное окно для редактирования навыков */}
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
        </Container>
    );
}

export default Settings;