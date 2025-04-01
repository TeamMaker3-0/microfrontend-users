// Profile.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Form, { Field, FormFooter } from "@atlaskit/form";
import TextField from "@atlaskit/textfield";
import Button from "@atlaskit/button";
import Heading from "@atlaskit/heading";

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  name: string;
  run: string;
  eneatype: string;
}

const ProfileView: React.FC = () => {
  const [userData, setUserData] = useState<JwtPayload | null>(null);
  const [profileMessage, setProfileMessage] = useState<string>("");
  const [passwordMessage, setPasswordMessage] = useState<string>("");

  // Al montar el componente, obtenemos la información del usuario del localStorage
  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  // Handler para actualizar la información del perfil (excepto eneatype)
  const onProfileSubmit = async (values: {
    name: string;
    email: string;
    run: string;
  }) => {
    if (!userData) return;
    try {
      // Se asume que el endpoint PUT para actualizar el usuario es /users/:id
      await axios.put(
        `http://4.228.227.51:3000/api/users/${userData.sub}`,
        values
      );
      setProfileMessage("Perfil actualizado correctamente.");

      // Actualizamos el state y localStorage con la nueva info
      const updatedUser = { ...userData, ...values };
      setUserData(updatedUser);
      localStorage.setItem("userData", JSON.stringify(updatedUser));
    } catch (error: any) {
      console.error(error);
      setProfileMessage("Error al actualizar el perfil.");
    }
  };

  // Handler para actualizar la contraseña
  const onPasswordSubmit = async (values: {
    oldPassword: string;
    newPassword: string;
  }) => {
    if (!userData) return;
    try {
      // Se asume que el endpoint para actualizar la contraseña es /users/:id/new-password
      await axios.put(
        `http://4.228.227.51:3000/api/users/${userData.sub}/new-password`,
        values
      );
      setPasswordMessage("Contraseña actualizada correctamente.");
    } catch (error: any) {
      console.error(error);
      setPasswordMessage("Error al actualizar la contraseña.");
    }
  };

  if (!userData) {
    return <p>Cargando información del usuario...</p>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div style={{ textAlign: "center" }}>
        <Heading size="xlarge">Perfil de usuario </Heading>
      </div>
      <Form<{ name: string; email: string; run: string }>
        onSubmit={onProfileSubmit}
      >
        {({ formProps, submitting }) => (
          <form {...formProps}>
            <Field
              name="name"
              label="Nombre"
              defaultValue={userData.name}
              isRequired
            >
              {({ fieldProps }) => <TextField {...fieldProps} />}
            </Field>
            <Field
              name="email"
              label="Email"
              defaultValue={userData.email}
              isRequired
              validate={(value = "") =>
                !/\S+@\S+\.\S+/.test(value) ? "Email inválido" : undefined
              }
            >
              {({ fieldProps, error }) => (
                <>
                  <TextField {...fieldProps} type="email" />
                  {error && <p style={{ color: "red" }}>{error}</p>}
                </>
              )}
            </Field>
            <Field
              name="run"
              label="RUN"
              defaultValue={userData.run}
              isRequired
              validate={(value = "") =>
                !/^\d{7,8}-[0-9Kk]$/.test(value)
                  ? "RUN inválido, formato sin puntos y con guión"
                  : undefined
              }
            >
              {({ fieldProps, error }) => (
                <>
                  <TextField {...fieldProps} />
                  {error && <p style={{ color: "red" }}>{error}</p>}
                </>
              )}
            </Field>
            {/* Mostrar el eneatipo en modo solo lectura */}
            <div style={{ marginTop: "16px", marginBottom: "16px" }}>
              <Heading size="medium">Eneatipo: Tipo {userData.eneatype}</Heading>
            </div>
            {/* Mostrar el eneatipo en modo solo lectura */}
            <div style={{ marginTop: "16px", marginBottom: "16px" }}>
                <Heading size="medium">Rol: {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)} </Heading>
            </div>
            <FormFooter>
              <Button appearance="primary" type="submit">
                Actualizar Perfil
              </Button>
            </FormFooter>
          </form>
        )}
      </Form>
      {profileMessage && <p>{profileMessage}</p>}

      <hr style={{ margin: "20px 0" }} />

      <Heading size="medium">Actualizar Contraseña</Heading>
      <Form<{ oldPassword: string; newPassword: string }>
        onSubmit={onPasswordSubmit}
      >
        {({ formProps, submitting }) => (
          <form {...formProps}>
            <Field name="oldPassword" label="Contraseña actual" isRequired>
              {({ fieldProps }) => (
                <TextField {...fieldProps} type="password" />
              )}
            </Field>
            <Field name="newPassword" label="Nueva contraseña" isRequired>
              {({ fieldProps }) => (
                <TextField {...fieldProps} type="password" />
              )}
            </Field>
            <FormFooter>
              <Button appearance="primary" type="submit">
                Actualizar Contraseña
              </Button>
            </FormFooter>
          </form>
        )}
      </Form>
      {passwordMessage && <p>{passwordMessage}</p>}
    </div>
  );
};

export default ProfileView;
