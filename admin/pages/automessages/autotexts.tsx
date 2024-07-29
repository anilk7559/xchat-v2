import { useEffect, useState } from "react";
import React from "react";
import { connect } from "react-redux";
import Head from "next/head";
import { Modal } from "react-bootstrap";
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
  Table,
} from "reactstrap";
import { toast } from "react-toastify";
import { authService } from "@services/auth.service";
import { baseurl } from "@services/api-request";
function Autotexts() {
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState("");
  const [messages, setMessages] = useState([]);
  const [getonemessage, setgetonemessage] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [rowId, setRowId] = useState("");
  const token = authService.getToken();
  
  const openModal = () => {
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await fetch(`${baseurl}/custome-message`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data && data.data && data.data.items) {
        setMessages(data.data.items);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlegetonemessage = (id) => {
    setRowId(id);
    openModal();
    const token = authService.getToken();
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${baseurl}/custome-message/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.code === 200) {
          setgetonemessage(data?.data?.message);
        } else {
          setgetonemessage("");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  };
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${baseurl}/custome-message/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not okay");
      }
      console.log(`Message with ID ${id} deleted successfully`);
      fetchData();
      toast.success("Nachricht erfolgreich gelöscht");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Nachricht konnte nicht gelöscht werden");
    }
  };
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    if (e.target.value.trim() === "") {
      setMessageError("Nachricht ist erforderlich");
    } else {
      setMessageError("");
    }
  };
  const handleAdd = async () => {
    if (message.trim() === "") {
      setMessageError("Nachricht ist erforderlich");
      return;
    }
    const requestBody = {
      message: message,
    };
    try {
      const response = await fetch(`${baseurl}/custome-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Netzwerkantwort war nicht in Ordnung");
      } else {
        fetchData();
        setMessage("");
        toast.success("Nachricht erfolgreich hinzugefügt");
      }
    } catch (error) {
      console.error(
        "Beim Hinzufügen der Nachricht ist ein Problem aufgetreten:",
        error
      );
      toast.error("Nachricht konnte nicht hinzugefügt werden");
    }
  };
  const handleInputChange2 = (event) => {
    setgetonemessage(event.target.value);
  };

  const handleupdate = async () => {
    if (getonemessage.trim() === "") {
      setMessageError("Nachricht ist erforderlich");
      return;
    }
    const requestBody = {
      message: getonemessage,
    };

    try {
      const response = await fetch(
        `${baseurl}/custome-message/${rowId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (!response.ok) {
        throw new Error("Netzwerkantwort war nicht in Ordnung");
      } else {
        fetchData();
        setgetonemessage("");
        toast.success("Nachricht erfolgreich aktualisiert");
        closeModal();
      }
    } catch (error) {
      console.error(
        "Es gab ein Problem beim Aktualisieren der Nachricht:",
        error
      );
      toast.error("Nachricht konnte nicht aktualisiert werden");
    }
  };

  return (
    <>
      <main className="main">
        <Head>
          <title>Automatische Nachrichten</title>
        </Head>
        <h4 className="title-table">Automatische Nachrichten</h4>
        <Container fluid className="content">
          <Form>
            <FormGroup>
              <Label for="message">Nachricht</Label>
              <Input
                type="textarea"
                name="message"
                id="message"
                value={message}
                onChange={handleMessageChange}
                invalid={messageError !== ""}
              />
              <FormFeedback>{messageError}</FormFeedback>
            </FormGroup>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button color="primary" onClick={handleAdd}>
                Hinzufügen
              </Button>
            </div>
          </Form>
        </Container>
      </main>
      <div className="container-fluid  mt-4">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Message</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.id}>
                <td>{message.message}</td>
                <td>{message.createdAt}</td>
                <td>{message.updatedAt}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handlegetonemessage(message.id)}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(message.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Modal
        dialogClassName="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-dialog-zoom"
        aria-labelledby="contained-modal-title-vcenter"
        show={open}
        onHide={closeModal}
        className="modal modal-lg-fullscreen fade"
      >
        <Modal.Header>
          <h5 className="modal-title" id="inviteUsersLabel">
            Edit Message
          </h5>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="input2">Message</label>
              <input
                type="text"
                className="form-control"
                id="input2"
                value={getonemessage}
                onChange={handleInputChange2}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-link text-muted"
            onClick={closeModal}
          >
            Schließen
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleupdate}
          >
            Update
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const mapStateToProps = (state: any) => ({ messages: state.messages });

export default connect(mapStateToProps, null)(Autotexts);
