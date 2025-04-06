import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader";
import Message from "../Message";
import Select from "react-select";

function Settings() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [accessToken, setAccessToken] = useState(userInfo?.access);
  const refreshToken = userInfo?.refresh;
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [availableSkills, setAvailableSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [status, setStatus] = useState(200);
  const [mainInfo, setMainInfo] = useState({
    image: "",
    name: "",
    rating: 0,
    skills: [],
    documents: [],
  });
  const [name, setName] = useState("");
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  const [selectedDocument, setSelectedDocument] = useState(null);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        try {
          const { data: mainData } = await axios.get(`/api/profile/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setMainInfo(mainData);
          setName(mainData.name);
          setSelectedSkills(
            mainData.skills.map((skill) => ({
              value: skill.id,
              label: skill.name,
            }))
          );
        } catch (error) {
          const config = {
            headers: {
              "Content-type": "application/json",
            },
          };
          const { data } = await axios.post(
            "/api/token/refresh/",
            {
              refresh: refreshToken,
            },
            config
          );
          userInfo.Access = data;
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
          setAccessToken(data);

          const { data: mainData } = await axios.get(`/api/profile/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setMainInfo(mainData);
          setName(mainData.name);
          setSelectedSkills(
            mainData.skills.map((skill) => ({
              value: skill.id,
              label: skill.name,
            }))
          );
        }
      } catch (error) {
        if (error.response.status != 401) {
          setError("Не удалось загрузить страницу, попробуйте позже.");
        } else {
          setStatus(401);
          setError("Ошибка. Не авторизованный пользователь.");
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchAvailableSkills = async () => {
      try {
        try {
          const { data } = await axios.get(`/api/search/skills/get/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          setAvailableSkills(
            data.map((skill) => ({
              value: skill.id,
              label: skill.name,
            }))
          );
        } catch (error) {
          const config = {
            headers: {
              "Content-type": "application/json",
            },
          };
          const { data } = await axios.post(
            "/api/token/refresh/",
            {
              refresh: refreshToken,
            },
            config
          );
          userInfo.Access = data;
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
          setAccessToken(data);

          const { data: skillData } = await axios.get(`/api/search/skills/get/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          setAvailableSkills(
            skillData.map((skill) => ({
              value: skill.id,
              label: skill.name,
            }))
          );
        }
      } catch (error) {
        if (error.response.status != 401) {
          setError("Не удалось загрузить страницу, попробуйте позже.");
        } else {
          setStatus(401);
          setError("Ошибка. Не авторизованный пользователь.");
        }
      }
    };

    fetchProfile();
    fetchAvailableSkills();
  }, []);

  useEffect(() => {
    if (error && status == 401) {
      navigate("/login");
    }
  }, [error]);

  const handleSkillsChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions || []);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      setLoading(true);
      try {
        try {
          const { data } = await axios.post("/api/profile/update/", formData, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          setMainInfo((prev) => ({
            ...prev,
            image: data.image,
          }));
        } catch (error) {
          const config = {
            headers: {
              "Content-type": "application/json",
            },
          };
          const { data } = await axios.post(
            "/api/token/refresh/",
            {
              refresh: refreshToken,
            },
            config
          );
          userInfo.Access = data;
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
          setAccessToken(data);

          const { data: updateData } = await axios.post(
            "/api/profile/update/",
            formData,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          setMainInfo((prev) => ({
            ...prev,
            image: updateData.image,
          }));
        }
      } catch (error) {
        if (error.response.status != 401) {
          setError("Не удалось обновить фото, попробуйте позже.");
        } else {
          setStatus(401);
          setError("Ошибка. Не авторизованный пользователь.");
        }
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
    setLoading(true);
    try {
      try {
        setIsUpdatingName(true);
        const { data } = await axios.post(
          "/api/profile/update/",
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
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { data } = await axios.post(
          "/api/token/refresh/",
          {
            refresh: refreshToken,
          },
          config
        );
        userInfo.Access = data;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        setAccessToken(data);

        setIsUpdatingName(true);
        const { data: updateData } = await axios.post(
          "/api/profile/update/",
          { name },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setMainInfo((prev) => ({
          ...prev,
          name: updateData.name,
        }));
      }
    } catch (error) {
      if (error.response.status != 401) {
        setError("Не удалось обновить имя, попробуйте позже.");
      } else {
        setStatus(401);
        setError("Ошибка. Не авторизованный пользователь.");
      }
    } finally {
      setLoading(false);
      setIsUpdatingName(false);
    }
  };

  const handleSkillsSave = async () => {
    setLoading(true);
    try {
      try {
        const { data } = await axios.post(
          "/api/profile/update/",
          { skills: selectedSkills.map((skill) => skill.value) },
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
      } catch (error) {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { data } = await axios.post(
          "/api/token/refresh/",
          {
            refresh: refreshToken,
          },
          config
        );
        userInfo.Access = data;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        setAccessToken(data);

        const { data: updateData } = await axios.post(
          "/api/profile/update/",
          { skills: selectedSkills.map((skill) => skill.value) },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setMainInfo((prev) => ({
          ...prev,
          skills: updateData.skills,
        }));
      }
    } catch (error) {
      if (error.response.status != 401) {
        setError("Не удалось обновить скиллы, попробуйте позже.");
      } else {
        setStatus(401);
        setError("Ошибка. Не авторизованный пользователь.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentOpen = (doc) => {
    setSelectedDocument(doc);
    setDocModalOpen(true);
  };

  const handleDocumentDelete = async () => {
    setLoading(true);
    try {
      try {
        await axios.post(
          `/api/profile/document/${selectedDocument.id}/delete/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setMainInfo((prevState) => ({
          ...prevState,
          documents: prevState.documents.filter(
            (doc) => doc.id !== selectedDocument.id
          ),
        }));
        setSelectedDocument(null);
        setDocModalOpen(false);
      } catch (error) {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { data } = await axios.post(
          "/api/token/refresh/",
          {
            refresh: refreshToken,
          },
          config
        );
        userInfo.Access = data;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        setAccessToken(data);

        await axios.post(
          `/api/profile/document/${selectedDocument.id}/delete/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setMainInfo((prevState) => ({
          ...prevState,
          documents: prevState.documents.filter(
            (doc) => doc.id !== selectedDocument.id
          ),
        }));
        setSelectedDocument(null);
        setDocModalOpen(false);
      }
    } catch (error) {
      if (error.response.status != 401) {
        setError("Не удалось удалить документ, попробуйте позже.");
      } else {
        setStatus(401);
        setError("Ошибка. Не авторизованный пользователь.");
      }
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
      alert("Выберите файл для загрузки!");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    setLoading(true);
    try {
      try {
        const response = await axios.put(
          "/api/profile/document/upload/",
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

        setSelectedFile(null);
      } catch (error) {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { data } = await axios.post(
          "/api/token/refresh/",
          {
            refresh: refreshToken,
          },
          config
        );
        userInfo.Access = data;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        setAccessToken(data);

        const response = await axios.put(
          "/api/profile/document/upload/",
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const uploadedDocument = response.data;
        setMainInfo((prevMainInfo) => ({
          ...prevMainInfo,
          documents: [...prevMainInfo.documents, uploadedDocument],
        }));

        setSelectedFile(null);
      }
    } catch (error) {
      if (error.response.status != 401) {
        setError("Не удалось загрузить документ, попробуйте позднее.");
      } else {
        setStatus(401);
        setError("Ошибка. Не авторизованный пользователь.");
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
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
                onClick={() => document.getElementById("imageInput").click()}
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
                  style={{ marginTop: "10px", width: "200px" }}
                >
                  {isUpdatingName ? "Сохранение..." : "Сохранить"}
                </Button>
              </div>
            </div>
            <Row className="mt-4">
              <Col>
                <Select
                  options={availableSkills}
                  isMulti
                  placeholder="Я владею следующими скиллами..."
                  value={selectedSkills}
                  onChange={handleSkillsChange}
                  className="skill-selector"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      width: "40vw",
                      minHeight: "6vh",
                      backgroundColor: "var(--bs-light)",
                      maxHeight: "20vh",
                      overflow: "auto",
                    }),
                    menu: (provided) => ({ ...provided, zIndex: 9999 }),
                    multiValue: (provided) => ({
                      ...provided,
                      backgroundColor: "var(--bs-secondary)",
                    }),
                    multiValueLabel: (provided) => ({
                      ...provided,
                      color: "var(--bs-body)",
                    }),
                  }}
                />
              </Col>
              <Col>
                <Button
                  variant="primary"
                  onClick={handleSkillsSave}
                  style={{ width: "200px" }}
                >
                  Сохранить
                </Button>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col>
                <Form.Group>
                  {!selectedFile ? (
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #ced4da",
                        padding: "8px 10px",
                        borderRadius: "5px",
                        backgroundColor: "#f8f9fa",
                      }}
                    >
                      <span
                        style={{
                          flexGrow: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={selectedFile.name}
                      >
                        {selectedFile.name}
                      </span>
                      <span
                        style={{
                          marginLeft: "10px",
                          cursor: "pointer",
                          color: "#dc3545",
                          fontSize: "1.25rem",
                          lineHeight: "2",
                        }}
                        title="Удалить файл"
                        onClick={removeFile}
                      >
                        × {}
                      </span>
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col>
                <Button
                  variant="primary"
                  onClick={handleFileUpload}
                  style={{ width: "200px" }}
                >
                  Сохранить
                </Button>
              </Col>
            </Row>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "2vw",
                width: "90%",
                marginTop: "2vh"
              }}
            >
              {mainInfo.documents.map((document) => (
                <div
                  key={document.id}
                  style={{ flex: "0 0 150px", maxWidth: "200px" }}
                >
                  <img
                    src={document.image}
                    alt="Profile"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() => handleDocumentOpen(document)}
                  />
                </div>
              ))}
            </div>
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
          <Button variant="danger" onClick={() => handleDocumentDelete()}>
            Удалить
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              const newTab = window.open();
              if (newTab) {
                newTab.location = selectedDocument.image;
              } else {
                console.error(
                  "Браузер заблокировал попытку открытия новой вкладки."
                );
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
