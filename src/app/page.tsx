"use client";

import { FormEvent, useEffect, useState } from "react";
import Item from "./types/item";
import FormResult from "./types/formResult";

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formResult, setFormResult] = useState<FormResult>({
    status: null,
    message: "",
  });

  useEffect(() => {
    const storedItems = localStorage.getItem("items");
    if (storedItems) {
      // temporarily load from localStorage while we fetch from the db
      setItems(JSON.parse(storedItems));
    }

    fetchItemsFromDb(); // lets fetch from the db after to obtain the latest data
  }, []);

  useEffect(() => {
    console.log(`Items retrieved: ${JSON.stringify(items)}`);
  }, [items]);

  async function fetchItemsFromDb() {
    try {
      const res = await fetch("api/items");
      const data = await res.json();

      if (data.error) {
        setError(data.message);
        return;
      }
      setItems(data.items);
      localStorage.setItem("items", JSON.stringify(data.items));
    } catch (error) {
      console.log("Error:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occured."
      );
    }
  }

  async function onSubmitCity(event: FormEvent<HTMLFormElement>) {
    setFormResult({ status: null, message: "" });
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formObject = Object.fromEntries(formData.entries());

    console.log("Sending JSON:", JSON.stringify(formObject));

    try {
      const response = await fetch("/api/items", {
        method: "POST",
        body: JSON.stringify(formObject),
      });

      const data = await response.json();
      setFormResult({ status: "success", message: data.message });
      fetchItemsFromDb();
    } catch (error) {
      setFormResult({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unknown error submitting city. Please try again.",
      });
    }
  }

  return (
    <div className="mx-auto max-w-sm my-20">
      <div className="mx-auto mb-10 flex justify-center items-center">
        {items && (
          <div className="justify-center mx-auto items-center">
            <div className="font-bold mb-1">Favorite Cities:</div>
            <ul className="list-disc list-inside">
              {items.map((item) => {
                const capitalizedName =
                  item.name.charAt(0).toUpperCase() + item.name.slice(1);
                return <li key={item.id}>{capitalizedName}</li>;
              })}
            </ul>
          </div>
        )}
      </div>

      <div className="mb-5">
        {error && items.length == 0 && <div>Error: {error}</div>}
        {error && items.length > 0 && (
          <div>
            Error: Could not retrieve the latest items from the cloud.
            Displaying backup.
          </div>
        )}
      </div>

      <form className="max-w-sm mx-auto" onSubmit={onSubmitCity}>
        <div className="mb-5">
          <label
            htmlFor="city"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Add A City Below!
          </label>
          <input
            type="text"
            id="city"
            name="name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="City Name"
            required
          />
        </div>

        <button
          type="submit"
          className="text-white mb-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>

        {formResult.status != null && <div>{formResult.message}</div>}
      </form>
    </div>
  );
}
