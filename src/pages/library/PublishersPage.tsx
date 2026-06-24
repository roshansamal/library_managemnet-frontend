import { useEffect, useState } from "react";

import {
  getPublishers,
  createPublisher,
  updatePublisher,
  deletePublisher,
} from "../../services/libraryPublishers.service";

export default function Publishers() {
  const [publishers, setPublishers] = useState<any[]>([]);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [publisherName, setPublisherName] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [contactNo, setContactNo] =
    useState("");

  useEffect(() => {
    loadPublishers();
  }, []);

  const loadPublishers = async () => {
    try {
      const data = await getPublishers();
      setPublishers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setPublisherName("");
    setAddress("");
    setContactNo("");
  };

  const handleAdd = async () => {
    try {
      await createPublisher({
        publisher_name: publisherName,
        address,
        contact_no: contactNo,
      });

      resetForm();
      loadPublishers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (publisher: any) => {
    setEditingId(
      publisher.publisher_id
    );

    setPublisherName(
      publisher.publisher_name
    );

    setAddress(
      publisher.address
    );

    setContactNo(
      publisher.contact_no
    );
  };

  const handleUpdate = async () => {
    try {
      if (!editingId) return;

      await updatePublisher(
        editingId,
        {
          publisher_name:
            publisherName,
          address,
          contact_no:
            contactNo,
        }
      );

      resetForm();
      loadPublishers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (
    id: number
  ) => {
    const confirmDelete =
      window.confirm(
        "Delete this publisher?"
      );

    if (!confirmDelete) return;

    try {
      await deletePublisher(id);
      loadPublishers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>
        Library Publishers
      </h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <input
          placeholder="Publisher Name"
          value={publisherName}
          onChange={(e) =>
            setPublisherName(
              e.target.value
            )
          }
        />

        <input
          placeholder="Address"
          value={address}
          onChange={(e) =>
            setAddress(
              e.target.value
            )
          }
        />

        <input
          placeholder="Contact No"
          value={contactNo}
          onChange={(e) =>
            setContactNo(
              e.target.value
            )
          }
        />

        <button
          onClick={
            editingId
              ? handleUpdate
              : handleAdd
          }
        >
          {editingId
            ? "Update Publisher"
            : "Add Publisher"}
        </button>

        {editingId && (
          <button
            onClick={
              resetForm
            }
          >
            Cancel
          </button>
        )}
      </div>

      <table
        border={1}
        cellPadding={10}
        style={{
          width: "100%",
          borderCollapse:
            "collapse",
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>
              Publisher Name
            </th>
            <th>Address</th>
            <th>
              Contact No
            </th>
            <th>
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {publishers.map(
            (publisher) => (
              <tr
                key={
                  publisher.publisher_id
                }
              >
                <td>
                  {
                    publisher.publisher_id
                  }
                </td>

                <td>
                  {
                    publisher.publisher_name
                  }
                </td>

                <td>
                  {
                    publisher.address
                  }
                </td>

                <td>
                  {
                    publisher.contact_no
                  }
                </td>

                <td>
                  <button
                    onClick={() =>
                      handleEdit(
                        publisher
                      )
                    }
                    style={{
                      marginRight:
                        "10px",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        publisher.publisher_id
                      )
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}