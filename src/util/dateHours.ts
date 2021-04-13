const dateHours = (start: Date, end: Date): number => {
    const difference: number = (end.getTime() - start.getTime()) / (60 * 60 * 1000);
    return difference;
}

export default dateHours;