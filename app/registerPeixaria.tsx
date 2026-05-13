import { PeixariaContext } from "@/context/PeixariaProvider";
import { Peixaria } from "@/model/Peixaria";
import { masks } from "@/utils/masks";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "react-native-paper";
import * as yup from "yup";

const requiredMessage = "Campo obrigatório";

const schema = yup
  .object()
  .shape({
    nome: yup.string().required(requiredMessage),
    email: yup
      .string()
      .required(requiredMessage)
      .matches(/\S+@\S+\.\S+/, "Email inválido"),
    telefone: yup
      .string()
      .required(requiredMessage)
      .matches(/^\(\d{2}\) \d{5}\-\d{4}$/, "Telefone inválido"),
    cpf: yup
      .string()
      .required(requiredMessage)
      .matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, "CPF inválido"),
    cnpj: yup
      .string()
      .required(requiredMessage)
      .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/, "CNPJ inválido"),
    descricao: yup
      .string()
      .max(150, "A descrição deve ter no máximo 150 caracteres"),
  })
  .required();

export default function RegPeixaria() {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      cpf: "",
      cnpj: "",
      descricao: "",
    },
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const { registerPeixaria } = useContext(PeixariaContext);
  const [requisitando, setRequisitando] = useState(false);
  const [dialogVisivel, setDialogVisivel] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", mensagem: "" });
  const [urlDevice, setUrlDevice] = useState("");

  async function cadPeixaria(data: Peixaria) {
    setRequisitando(true);
    const msg = await registerPeixaria(data, urlDevice);
    if (msg === "OK") {
      setMensagem({
        tipo: "OK",
        mensagem: `Sua peixaria foi cadastrada com sucesso`,
      });
      setDialogVisivel(true);
      setRequisitando(false);
    } else {
      setMensagem({ tipo: "erro", mensagem: msg });
      setDialogVisivel(true);
      setRequisitando(false);
    }
  }

  async function buscarNaGaleria() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setUrlDevice(result.assets[0].uri);
    }
  }

  async function tirarFoto() {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setUrlDevice(result.assets[0].uri);
    }
  }

  return (
    <SafeAreaView
      style={{ ...styles.container, backgroundColor: theme.colors.background }}
    >
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <>
          <Image
            style={styles.image}
            source={
              urlDevice !== ""
                ? { uri: urlDevice }
                : require("../assets/images/shoal/Shoal(Logo).png")
            }
          />
          <View style={styles.divButtonsImage}>
            <Button
              style={styles.buttonImage}
              mode="outlined"
              icon="image"
              onPress={buscarNaGaleria}
            >
              Galeria
            </Button>
            <Button
              style={styles.buttonImage}
              mode="outlined"
              icon="camera"
              onPress={tirarFoto}
            >
              Foto
            </Button>
          </View>
          <Controller
            control={control}
            name="nome"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.textinput}
                label="Nome"
                placeholder="Digite o nome da sua peixaria"
                mode="outlined"
                autoCapitalize="words"
                returnKeyType="next"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                right={<TextInput.Icon icon="smart-card" />}
              />
            )}
          />
          {errors.nome && (
            <Text style={{ ...styles.textError, color: theme.colors.error }}>
              {errors.nome?.message?.toString()}
            </Text>
          )}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.textinput}
                label="E-mail"
                placeholder="Digite seu e-mail"
                mode="outlined"
                autoCapitalize="none"
                returnKeyType="next"
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                right={<TextInput.Icon icon="email" />}
              />
            )}
          />
          {errors.email && (
            <Text style={{ ...styles.textError, color: theme.colors.error }}>
              {errors.email?.message?.toString()}
            </Text>
          )}
          <Controller
            control={control}
            name="telefone"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.textinput}
                label="Telefone"
                placeholder="(00) 00000-0000"
                mode="outlined"
                keyboardType="phone-pad"
                onBlur={onBlur}
                onChangeText={(text) => onChange(masks.telefone(text))}
                value={value}
                right={<TextInput.Icon icon="phone" />}
              />
            )}
          />
          {errors.telefone && (
            <Text style={{ ...styles.textError, color: theme.colors.error }}>
              {errors.telefone?.message?.toString()}
            </Text>
          )}
          <Controller
            control={control}
            name="cpf"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.textinput}
                label="CPF"
                placeholder="000.000.000-00"
                mode="outlined"
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={(text) => onChange(masks.cpf(text))}
                value={value}
                right={<TextInput.Icon icon="account-details" />}
              />
            )}
          />
          {errors.cpf && (
            <Text style={{ ...styles.textError, color: theme.colors.error }}>
              {errors.cpf?.message?.toString()}
            </Text>
          )}
          <Controller
            control={control}
            name="cnpj"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.textinput}
                label="CNPJ"
                placeholder="00.000.000/0001-00"
                mode="outlined"
                keyboardType="numeric"
                returnKeyType="next"
                onBlur={onBlur}
                onChangeText={(text) => onChange(masks.cnpj(text))}
                value={value}
                right={<TextInput.Icon icon="office-building" />}
              />
            )}
          />
          {errors.cnpj && (
            <Text style={{ ...styles.textError, color: theme.colors.error }}>
              {errors.cnpj?.message?.toString()}
            </Text>
          )}
          <Controller
            control={control}
            name="descricao"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.textinput}
                label="Descricao(Opicional)"
                mode="outlined"
                autoCapitalize="words"
                returnKeyType="next"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                right={<TextInput.Icon icon="card-text-outline" />}
              />
            )}
          />
          {errors.descricao && (
            <Text style={{ ...styles.textError, color: theme.colors.error }}>
              {errors.descricao?.message?.toString()}
            </Text>
          )}
          <Button
            style={styles.button}
            mode="outlined"
            onPress={handleSubmit(cadPeixaria)}
            loading={requisitando}
            disabled={requisitando}
          >
            {!requisitando ? "Cadastrar" : "Cadastrando"}
          </Button>
        </>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
    borderRadius: 200 / 2,
    marginTop: 50,
  },
  textinput: {
    width: 350,
    height: 50,
    marginTop: 20,
    backgroundColor: "transparent",
  },
  textEsqueceuSenha: {
    alignSelf: "flex-end",
    marginTop: 20,
  },
  textCadastro: {},
  textError: {
    width: 350,
  },
  button: {
    marginTop: 50,
    marginBottom: 30,
  },
  divButtonsImage: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 20,
  },
  buttonImage: {
    width: 180,
  },
  textDialog: {
    textAlign: "center",
  },
});
