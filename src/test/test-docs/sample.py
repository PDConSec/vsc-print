def main(master_path):

    #this code puts the logs and environment details in the directory component of input_path; if input path ends in a directory name, 
    # it will be treated as a directory not the file; i.e. f"G:\directoryname" will be treated as a request to put output inside G:\directoryname
    #and not as a request to handle a file called "directoryname" in G:\
    #log file mode should be W or omitted to overwrite the log each time the program runs; and should be "a" if the program is meant to 
    #add log entries on each of a series of repeated runs -- "a" is appropriate for e.g. webscraping programs designed
    # to pick up where they left off and produce results cumulatively
    log = get_logger(master_path, __file__, __name__, logging.DEBUG, log_file_mode="w")


    for diversity_parameter_times_10 in range(max_div_weight*10+1):
        differentiation_weight = diversity_parameter_times_10/10
        #backing off to a weight of .999 rather than 1.0 allows the citation counts to act as a tiebreaker.
        (selection_vector,cites_score, citing_authors_score,weighted_score)=find_greedy_solution(authornet_dict,max_depth,differentiation_weight,production_possibility_file,noncore_vector_to_exclude,production_possibility_list,log)

