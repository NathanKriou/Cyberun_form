import React, { useState } from "react";
import { Layout, Menu, Drawer, Button, message } from "antd";
import { schema, uiSchema, data as initialData } from "./schema1";
import { schema2, uiSchema2, data2 as initialData2 } from "./schema2";
import "antd/dist/reset.css"; // Pour les styles Ant Design
import CategorizationRenderer from "./components/CategorizationRenderer";
import "./App.css";

const { Header, Content } = Layout;

const App: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [data, setData] = useState(initialData);
  const [data2, setData2] = useState(initialData2);

  const openDrawer = () => setVisible(true);
  const closeDrawer = () => setVisible(false);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    closeDrawer();
  };

  const handleChange = ({ data }: { data: any }) => {
    if (
      selectedCategory &&
      ["Identité", "Localisation", "Contact"].includes(selectedCategory)
    ) {
      setData(data);
    } else {
      setData2(data);
    }
  };

  const validateForm = (formData: any, formSchema: any) => {
    for (const key in formSchema.properties) {
      if (!formData[key]) {
        message.error(
          `Le champ ${formSchema.properties[key].title} est requis`
        );
        return false;
      }
      if (formSchema.properties[key].pattern) {
        const regex = new RegExp(formSchema.properties[key].pattern);
        if (!regex.test(formData[key])) {
          message.error(
            `Le champ ${formSchema.properties[key].title} n'est pas au bon format`
          );
          return false;
        }
      }
      if (
        formSchema.properties[key].format === "email" &&
        !/\S+@\S+\.\S+/.test(formData[key])
      ) {
        message.error(
          `Le champ ${formSchema.properties[key].title} n'est pas au bon format`
        );
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (
      selectedCategory &&
      ["Identité", "Localisation", "Contact"].includes(selectedCategory)
    ) {
      if (validateForm(data, schema)) {
        console.log("Formulaire soumis :", data);
        message.success("Formulaire soumis avec succès !");
      }
    } else {
      if (validateForm(data2, schema2)) {
        console.log("Formulaire soumis :", data2);
        message.success("Formulaire soumis avec succès !");
      }
    }
  };

  const renderForm = () => {
    if (!selectedCategory) {
      return (
        <div>
          Veuillez sélectionner une catégorie dans l'onglet 'Mon compte'
        </div>
      );
    }

    let selectedUiSchema;
    let selectedData;
    let selectedSchema;

    if (["Identité", "Localisation", "Contact"].includes(selectedCategory)) {
      selectedUiSchema = {
        type: "Categorization",
        label: selectedCategory,
        elements: uiSchema.elements.filter(
          (element) => element.label === selectedCategory
        ),
      };
      selectedData = data;
      selectedSchema = schema;
    } else {
      selectedUiSchema = {
        type: "Categorization",
        label: selectedCategory,
        elements: uiSchema2.elements.filter(
          (element) => element.label === selectedCategory
        ),
      };
      selectedData = data2;
      selectedSchema = schema2;
    }

    return (
      <div className="form-container">
        <CategorizationRenderer
          schema={selectedSchema}
          uiSchema={selectedUiSchema as any}
          data={selectedData}
          onChange={handleChange}
        />
        <Button type="primary" onClick={handleSubmit} style={{ marginTop: 20 }}>
          Soumettre
        </Button>
      </div>
    );
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Button type="primary" onClick={openDrawer} className="drawer-button">
        Mon Compte
      </Button>
      <Layout className="main-layout" style={{ marginLeft: 200 }}>
        <Header className="main-header" />
        <Content className="main-content">{renderForm()}</Content>
      </Layout>
      <Drawer
        title="Sélectionnez une catégorie"
        placement="left"
        onClose={closeDrawer}
        visible={visible}
        width={250}
      >
        <Menu
          mode="inline"
          onClick={({ key }) => handleCategoryClick(key)}
          defaultOpenKeys={["set1", "set2"]}
        >
          <Menu.SubMenu key="set1" title="Informations">
            <Menu.Item key="Identité">Identité</Menu.Item>
            <Menu.Item key="Localisation">Localisation</Menu.Item>
            <Menu.Item key="Contact">Contact</Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="set2" title="Supplémentaire">
            <Menu.Item key="Professionnel">Professionnel</Menu.Item>
            <Menu.Item key="Diplôme">Diplôme</Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Drawer>
    </Layout>
  );
};

export default App;
