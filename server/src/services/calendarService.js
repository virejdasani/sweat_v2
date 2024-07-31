const extractReadingWeek = (events, semester) => {
  const getReadingWeeks = (semesterKeyword) => {
    const filteredEvents = events.filter((event) =>
      event.title.includes(`${semesterKeyword} Reading Week`),
    );

    const weeks = filteredEvents
      .map((event) => {
        const weekMatch = event.title.match(/\(Week (\d+)\)/);
        return weekMatch ? parseInt(weekMatch[1], 10) : null;
      })
      .filter((week) => week !== null);

    return weeks;
  };

  if (semester === 'first') {
    const sem1Weeks = getReadingWeeks('Sem 1');
    return sem1Weeks;
  } else if (semester === 'second') {
    const sem2Weeks = getReadingWeeks('Sem 2');
    return sem2Weeks;
  } else if (semester === 'whole session') {
    const sem1Weeks = getReadingWeeks('Sem 1');
    const sem2Weeks = getReadingWeeks('Sem 2');
    const readingWeeks = { sem1: sem1Weeks, sem2: sem2Weeks };
    return readingWeeks;
  }
};

module.exports = { extractReadingWeek };
