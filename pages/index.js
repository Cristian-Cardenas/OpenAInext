import Head from "next/head";
import { useState } from "react";
import styles from "../styles/index.module.css"
import { jsPDF } from "jspdf";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result1, setResult1] = useState();
  const [result2, setResult2] = useState();
  const [result3, setResult3] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response1 = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });
      const data1 = await response1.json();
      if (response1.status !== 200) {
        throw data1.error || new Error(`Request failed with status ${response1.status}`);
      }
      setResult1(data1.result);
      setAnimalInput("");

      const response2 = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });
      const data2 = await response2.json();
      if (response2.status !== 200) {
        throw data2.error || new Error(`Request failed with status ${response2.status}`);
      }
      setResult2(data2.result);
      const response3 = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });
      const data3 = await response3.json();
      if (response3.status !== 200) {
        throw data2.error || new Error(`Request failed with status ${response3.status}`);
      }
      setResult3(data3.result);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }
  function handleChange(event) {
    const select1Value = document.getElementById('select1').value;
    const select2Value = document.getElementById('select2').value;
    if (select1Value === 'opcion2' && select2Value === 'opcion2') {
      onSubmit(event);
    }
  }
  function generarpdf() {
    const inputElement = document.getElementById("image-input");
    const file = inputElement.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const imageWidth = 100;
      const imageHeight = 100;
      const x = (pageWidth - imageWidth) / 2;
      const y = (pageHeight - imageHeight) / 2;
      doc.addImage(reader.result, 'JPEG', x, y, imageWidth, imageHeight,'NONE');
      doc.setFontSize(6);
      doc.text(result1, 10, 10);
      doc.text(result2, 10, 60);
      doc.text(result3, 10, 100);
      
      doc.save("a4.pdf");
    }
  }

  return (
    <div id="my-html-element">
      <Head>
        <title>OpenAI</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.titulo}>
          <h2>Escoje el tipo de empresa</h2>
        </div>
        <div>
          <select className={styles.selects} id="select1" onChange={handleChange}>
            <option value="opcion1">---</option>
            <option value="opcion2">Peluqueria</option>
          </select>
        </div>
        <div className={styles.titulo}>
          <h2>Escoje el recurso</h2>
        </div>
        <div>
          <select className={styles.selects} id="select2" onChange={handleChange}>
            <option value="opcion1">---</option>
            <option value="opcion2">Lead Magnet</option>
          </select>
        </div>
        <div>
          <form onSubmit={onSubmit}>
            {isSubmitting ? (
              <div className={styles.wait}>Espera mientras se descargan las respuestas...
              </div>
            ) : (
              <h1></h1>
            )}
          </form>
        </div>
        <p className={styles.p}>Selecciona tu logo</p>
        <div className={styles.contenedorflex}>
          <div>
            <input className={styles.left} type="file" id="image-input" onchange="loadImage()" />
          </div>
          <div className={styles.buttonpdf}>
            <input type="button" value="Generar PDF" onClick={generarpdf} />
          </div>
        </div>
      </main>
      <div className={styles.resultados}>
        <div className={styles.resultado}>{result1}</div>
        <div className={styles.resultado}>{result2}</div>
        <div className={styles.resultado}>{result3}</div>
      </div>
    </div>
  );
}