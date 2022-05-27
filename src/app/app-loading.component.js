import React from 'react';

export const AppLoading = props => {
  const [loading, setLoading] = React.useState(true);
  const loadingResult = React.useMemo(() => {
    return props.initialConfig || {};
  }, [props.initialConfig]);

  const onTasksFinish = () => {
    setLoading(false);
  };

  React.useEffect(() => {
    if (loading) {
      startTasks().then(onTasksFinish);
    }
  }, [loading, startTasks]);

  const saveTaskResult = React.useCallback(
    result => {
      if (result) {
        loadingResult[result[0]] = result[1];
      }
    },
    [loadingResult],
  );

  const createRunnableTask = React.useCallback(
    task => {
      return task().then(saveTaskResult);
    },
    [saveTaskResult],
  );

  const startTasks = React.useCallback(async () => {
    if (props.tasks) {
      return Promise.all(props.tasks.map(createRunnableTask));
    }
    return Promise.resolve();
  }, [createRunnableTask, props.tasks]);

  return (
    <React.Fragment>
      {!loading && props.children(loadingResult)}
      {props.placeholder && props.placeholder({loading})}
    </React.Fragment>
  );
};
