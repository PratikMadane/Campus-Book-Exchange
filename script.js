
const sampleBooks = [
    {
        id: 1,
        title: "Engineering Mathematics",
        category: "Book",
        subject: "Mathematics",
        price: 250,
        condition: "Good",
        deal: "Sale",
        seller: "Rahul",
        contact: "rahul@example.com"
    },
    {
        id: 2,
        title: "Computer Networks Notes",
        category: "Notes",
        subject: "Computer Networks",
        price: 0,
        condition: "Digital Copy",
        deal: "Free",
        seller: "Priya",
        contact: "priya@example.com"
    },
    {
        id: 3,
        title: "Data Structures Textbook",
        category: "Book",
        subject: "Programming",
        price: 180,
        condition: "Used",
        deal: "Exchange",
        seller: "Amit",
        contact: "amit@example.com"
    },
    {
        id: 4,
        title: "Database Management Notes",
        category: "Notes",
        subject: "DBMS",
        price: 50,
        condition: "Good",
        deal: "Sale",
        seller: "Sneha",
        contact: "sneha@example.com"
    }
];

let books;

try {
    const saved = localStorage.getItem("campusBooks");
    books = saved ? JSON.parse(saved) : sampleBooks;
    if (!Array.isArray(books)) books = sampleBooks;
} catch (error) {
    books = sampleBooks;
}

const bookList = document.getElementById("bookList");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const listingForm = document.getElementById("listingForm");
const message = document.getElementById("message");

function saveBooks() {
    try {
        localStorage.setItem("campusBooks", JSON.stringify(books));
    } catch (error) {
        message.textContent =
            "Could not save listings in this browser.";
    }
}

function displayBooks() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    const filteredBooks = books.filter(book => {
        const matchesSearch =
            book.title.toLowerCase().includes(searchText) ||
            book.subject.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            book.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    bookList.replaceChildren();

    if (filteredBooks.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No books or notes found.";
        bookList.appendChild(emptyMessage);
        return;
    }

    filteredBooks.forEach(book => {
        const card = document.createElement("div");
        card.className = "book-card";

        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = book.category;

        const title = document.createElement("h3");
        title.textContent = book.title;

        const subject = document.createElement("p");
        subject.textContent = "Subject: " + book.subject;

        const price = document.createElement("p");
        price.className = "price";
        price.textContent =
            Number(book.price) === 0
                ? "Free"
                : "₹" + Number(book.price);

        const condition = document.createElement("p");
        condition.textContent = "Condition: " + book.condition;

        const deal = document.createElement("p");
        deal.textContent = "Type: " + book.deal;

        const seller = document.createElement("p");
        seller.textContent = "Seller: " + book.seller;

        const contactButton = document.createElement("button");
        contactButton.className = "btn";
        contactButton.textContent = "Contact Seller";

        contactButton.addEventListener("click", () => {
            alert(
                "Seller: " + book.seller +
                "\nContact: " + book.contact +
                "\nListing: " + book.title
            );
        });

        card.append(
            tag, title, subject, price,
            condition, deal, seller, contactButton
        );

        bookList.appendChild(card);
    });
}

listingForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const newBook = {
        id: Date.now(),
        title: document.getElementById("title").value.trim(),
        category: document.getElementById("category").value,
        subject: document.getElementById("subject").value.trim(),
        price: Number(document.getElementById("price").value),
        condition: document.getElementById("condition").value,
        deal: document.getElementById("deal").value,
        seller: document.getElementById("seller").value.trim(),
        contact: document.getElementById("contact").value.trim()
    };

    if (
        !newBook.title ||
        !newBook.subject ||
        !newBook.seller ||
        !newBook.contact ||
        !Number.isFinite(newBook.price) ||
        newBook.price < 0
    ) {
        message.textContent = "Please enter valid details.";
        return;
    }

    books.unshift(newBook);
    saveBooks();

    listingForm.reset();
    message.textContent = "Listing added successfully!";

    displayBooks();
    document.getElementById("books").scrollIntoView();
});

searchInput.addEventListener("input", displayBooks);
categoryFilter.addEventListener("change", displayBooks);

displayBooks();
