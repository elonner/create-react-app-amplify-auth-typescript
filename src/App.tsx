import axios from "axios";
import { Button, Col, Input, Slider, Typography, Row } from "antd";
import React, { useState } from "react";
import { Amplify } from "aws-amplify";
import {
  AmplifyProvider,
  Authenticator,
  Flex,
  Image,
  View,
} from "@aws-amplify/ui-react";
import aws_exports from "./aws-exports";

import "@aws-amplify/ui-react/styles.css";
import theme from "./theme";
import logo from "./logo.svg";

const { TextArea } = Input;

const { Text } = Typography;

Amplify.configure(aws_exports);

const apiKey = "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";

const client = axios.create({
  headers: {
    Authorization: "Bearer " + apiKey,
  },
});

const params = {
  prompt: "How are you?",
  model: "text-davinci-003",
  max_tokens: 10,
  temperature: 0,
};

const App = () => {
  const [payload, setPayload] = useState("");
  const [gptResponse, setGptResponse] = useState("");
  const [temperature, setTemperature] = useState(0);
  const [maxTokens, setMaxTokens] = useState(100);

  const handleSubmitPrompt = (): void => {
    client
      .post("https://api.openai.com/v1/completions", {
        prompt: payload,
        model: "text-davinci-003",
        max_tokens: maxTokens,
        temperature: temperature,
      })
      .then((result) => {
        console.log(result.data.choices[0].text);
        setGptResponse(result.data.choices[0].text);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onTemperatureChange = (temp: number) => {
    setTemperature(temp);
  };
  const onMaxTokensChange = (tokens: number) => {
    setMaxTokens(tokens);
  };

  return (
    <AmplifyProvider theme={theme}>
      <Authenticator>
        {({ signOut, user }) => (
          <Flex
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            alignContent="flex-start"
            wrap="nowrap"
            gap="1rem"
            textAlign="center"
          >
            <Row>
              <TextArea
                placeholder="prompt"
                onChange={(e) => setPayload(e.target.value)}
                rows={4}
              />
            </Row>
            <Row>
              <Col span={8}>
                <Slider
                  min={0}
                  max={1}
                  onChange={onTemperatureChange}
                  value={temperature}
                  step={0.01}
                />
              </Col>
              <Col span={8}>
                <Slider
                  min={100}
                  max={1000}
                  onChange={onMaxTokensChange}
                  value={maxTokens}
                />
              </Col>
              <Col span={8}>
                <Button onClick={handleSubmitPrompt}>Submit Prompt</Button>
              </Col>
            </Row>
            <Row>
              <Text>{gptResponse}</Text>
            </Row>
          </Flex>
        )}
      </Authenticator>
    </AmplifyProvider>
  );
};

export default App;
