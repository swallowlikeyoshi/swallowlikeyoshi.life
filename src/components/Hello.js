import { Card, CardBody } from "react-bootstrap";
import SunLottie from "./SunLottie";
import 'bootstrap/dist/css/bootstrap.min.css'
function App() {
  return (
    <div className="App">
        <Card>
          <CardBody>
            <SunLottie />
            <h1 className="text-center">안녕하세요!</h1>
            <p className="text-center">swallowlikeyoshi의 웹사이트입니다.</p>
          </CardBody>
        </Card>
    </div>
  );
}

export default App;
