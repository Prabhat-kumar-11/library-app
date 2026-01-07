export interface BookProps {
  isbn: string;
  title: string;
  author: string;
  availableCopies: number;
  description?: string;
  publishedYear?: number;
}

export class Book {
  readonly isbn: string;
  readonly title: string;
  readonly author: string;
  private _availableCopies: number;
  readonly description?: string;
  readonly publishedYear?: number;

  constructor(props: BookProps) {
    this.validateProps(props);
    
    this.isbn = props.isbn;
    this.title = props.title;
    this.author = props.author;
    this._availableCopies = props.availableCopies;
    this.description = props.description;
    this.publishedYear = props.publishedYear;
  }

  private validateProps(props: BookProps): void {
    if (!props.isbn || props.isbn.trim() === '') {
      throw new Error('ISBN is required');
    }
    if (!props.title || props.title.trim() === '') {
      throw new Error('Title is required');
    }
    if (!props.author || props.author.trim() === '') {
      throw new Error('Author is required');
    }
    if (props.availableCopies < 0) {
      throw new Error('Available copies cannot be negative');
    }
  }

  get availableCopies(): number {
    return this._availableCopies;
  }

  isAvailable(): boolean {
    return this._availableCopies > 0;
  }

  decrementCopies(): void {
    if (this._availableCopies === 0) {
      throw new Error('No copies available to borrow');
    }
    this._availableCopies--;
  }

  incrementCopies(): void {
    this._availableCopies++;
  }

  toJSON() {
    return {
      isbn: this.isbn,
      title: this.title,
      author: this.author,
      availableCopies: this._availableCopies,
      description: this.description,
      publishedYear: this.publishedYear,
    };
  }
}

